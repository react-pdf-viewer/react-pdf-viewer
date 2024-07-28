/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';
import { useIntersectionObserver } from './hooks/useIntersectionObserver';
import { usePrevious } from './hooks/usePrevious';
import { Inner } from './layouts/Inner';
import { PageSizeCalculator } from './layouts/PageSizeCalculator';
import { DocumentLoader, RenderError } from './loader/DocumentLoader';
import { StackContext } from './portal/StackContext';
import { BreakpointContext } from './responsive/BreakpointContext';
import { useBreakpoint } from './responsive/useBreakpoint';
import { FullScreenMode } from './structs/FullScreenMode';
import { ScrollMode } from './structs/ScrollMode';
import { SpecialZoomLevel } from './structs/SpecialZoomLevel';
import { ViewMode } from './structs/ViewMode';
import styles from './styles/viewer.module.css';
import { ThemeContext } from './theme/ThemeContext';
import { type CharacterMap } from './types/CharacterMap';
import { type DocumentAskPasswordEvent } from './types/DocumentAskPasswordEvent';
import { type DocumentLoadEvent } from './types/DocumentLoadEvent';
import { type PageChangeEvent } from './types/PageChangeEvent';
import { type PageLayout } from './types/PageLayout';
import { type PageSize } from './types/PageSize';
import { type PdfJs } from './types/PdfJs';
import { type Plugin } from './types/Plugin';
import { type RenderPage } from './types/RenderPage';
import { type RenderProtectedView } from './types/RenderProtectedView';
import { type RotateEvent } from './types/RotateEvent';
import { type RotatePageEvent } from './types/RotatePageEvent';
import { type SetRenderRange, type VisiblePagesRange } from './types/SetRenderRange';
import { type VisibilityChanged } from './types/VisibilityChanged';
import { type ZoomEvent } from './types/ZoomEvent';
import { isSameUrl } from './utils/isSameUrl';
import { mergeRefs } from './utils/mergeRefs';

interface FileState {
    data: PdfJs.FileData;
    name: string;
    shouldLoad: boolean;
}

const NUM_OVERSCAN_PAGES = 3;
const DEFAULT_RENDER_RANGE: SetRenderRange = (visiblePagesRange: VisiblePagesRange) => {
    return {
        startPage: visiblePagesRange.startPage - NUM_OVERSCAN_PAGES,
        endPage: visiblePagesRange.endPage + NUM_OVERSCAN_PAGES,
    };
};

export const Viewer: React.FC<{
    characterMap?: CharacterMap;
    // The default zoom level
    // If it's not set, the initial zoom level will be calculated based on the dimesion of page and the container width
    defaultScale?: number | SpecialZoomLevel;
    // Enable smooth scroll
    enableSmoothScroll?: boolean;
    fileUrl: string | Uint8Array;
    // Additional authentication headers
    httpHeaders?: Record<string, string | string[]>;
    // The page (zero-index based) that will be displayed initially
    initialPage?: number;
    // The initial rotation, must be divisible by 90
    initialRotation?: number;
    pageLayout?: PageLayout;
    // Plugins
    plugins?: Plugin[];
    renderError?: RenderError;
    renderLoader?(percentages: number): React.ReactElement;
    renderPage?: RenderPage;
    renderProtectedView?: RenderProtectedView;
    scrollMode?: ScrollMode;
    setRenderRange?: SetRenderRange;
    transformGetDocumentParams?(options: PdfJs.GetDocumentParams): PdfJs.GetDocumentParams;
    viewMode?: ViewMode;
    // Indicate the cross-site requests should be made with credentials such as cookie and authorization headers.
    // The default value is `false`
    withCredentials?: boolean;
    onDocumentAskPassword?(e: DocumentAskPasswordEvent): void;
    onDocumentLoad?(e: DocumentLoadEvent): void;
    onPageChange?(e: PageChangeEvent): void;
    onRotate?(e: RotateEvent): void;
    onRotatePage?(e: RotatePageEvent): void;
    // Invoked after switching to `theme`
    onSwitchTheme?(theme: string): void;
    onZoom?(e: ZoomEvent): void;
}> = ({
    characterMap,
    defaultScale,
    enableSmoothScroll = true,
    fileUrl,
    httpHeaders = {},
    initialPage = 0,
    pageLayout,
    initialRotation = 0,
    plugins = [],
    renderError,
    renderLoader,
    renderPage,
    renderProtectedView,
    scrollMode = ScrollMode.Vertical,
    setRenderRange = DEFAULT_RENDER_RANGE,
    transformGetDocumentParams,
    viewMode = ViewMode.SinglePage,
    withCredentials = false,
    onDocumentAskPassword,
    onDocumentLoad = () => {
        /**/
    },
    onPageChange = () => {
        /**/
    },
    onRotate = () => {
        /**/
    },
    onRotatePage = () => {
        /**/
    },
    onSwitchTheme = () => {
        /**/
    },
    onZoom = () => {
        /**/
    },
}) => {
    const [file, setFile] = React.useState<FileState>({
        data: fileUrl,
        name: typeof fileUrl === 'string' ? fileUrl : '',
        shouldLoad: false,
    });

    const openFile = (fileName: string, data: Uint8Array) => {
        setFile({
            data,
            name: fileName,
            shouldLoad: true,
        });
    };
    const [visible, setVisible] = React.useState(false);

    const prevFile = usePrevious<FileState>(file);

    React.useEffect(() => {
        // If the document is changed
        if (!isSameUrl(prevFile.data, fileUrl)) {
            setFile({
                data: fileUrl,
                name: typeof fileUrl === 'string' ? fileUrl : '',
                shouldLoad: visible,
            });
        }
    }, [fileUrl, visible]);

    const visibilityChanged = (params: VisibilityChanged): void => {
        setVisible(params.isVisible);
        if (params.isVisible) {
            setFile((currentFile) => Object.assign({}, currentFile, { shouldLoad: true }));
        }
    };

    const trackIntersectionRef = useIntersectionObserver({
        onVisibilityChanged: visibilityChanged,
    });

    // Manage contexts
    const [trackBreakpointRef, breakpoint] = useBreakpoint();
    const containerRef = mergeRefs([trackIntersectionRef, trackBreakpointRef]);
    const { currentTheme } = React.useContext(ThemeContext);
    const prevTheme = usePrevious(currentTheme);

    const [numStacks, setNumStacks] = React.useState(0);
    const increaseNumStacks = () => setNumStacks((v) => v + 1);
    const decreaseNumStacks = () => setNumStacks((v) => v - 1);

    React.useEffect(() => {
        if (currentTheme !== prevTheme && onSwitchTheme) {
            onSwitchTheme(currentTheme);
        }
    }, [currentTheme]);

    return (
        <StackContext.Provider value={{ currentIndex: 0, increaseNumStacks, decreaseNumStacks, numStacks }}>
            <BreakpointContext.Provider value={breakpoint}>
                <div
                    ref={containerRef}
                    className={styles.viewer}
                    data-testid="core__viewer"
                    style={{
                        height: '100%',
                        width: '100%',
                    }}
                >
                    {file.shouldLoad && (
                        <DocumentLoader
                            characterMap={characterMap}
                            file={file.data}
                            httpHeaders={httpHeaders}
                            render={(doc: PdfJs.PdfDocument) => (
                                <PageSizeCalculator
                                    defaultScale={defaultScale}
                                    doc={doc}
                                    render={(estimatedPageSizes: PageSize[], initialScale: number) => (
                                        <Inner
                                            currentFile={{
                                                data: file.data,
                                                name: file.name,
                                            }}
                                            defaultScale={defaultScale}
                                            doc={doc}
                                            enableSmoothScroll={enableSmoothScroll}
                                            estimatedPageSizes={estimatedPageSizes}
                                            initialPage={initialPage}
                                            initialRotation={initialRotation}
                                            initialScale={initialScale}
                                            initialScrollMode={scrollMode}
                                            initialViewMode={viewMode}
                                            pageLayout={pageLayout}
                                            plugins={plugins}
                                            renderPage={renderPage}
                                            setRenderRange={setRenderRange}
                                            viewerState={{
                                                file,
                                                fullScreenMode: FullScreenMode.Normal,
                                                pageIndex: -1,
                                                pageHeight: estimatedPageSizes[0].pageHeight,
                                                pageWidth: estimatedPageSizes[0].pageWidth,
                                                pagesRotation: new Map(),
                                                rotation: initialRotation,
                                                scale: initialScale,
                                                scrollMode,
                                                viewMode,
                                            }}
                                            onDocumentLoad={onDocumentLoad}
                                            onOpenFile={openFile}
                                            onPageChange={onPageChange}
                                            onRotate={onRotate}
                                            onRotatePage={onRotatePage}
                                            onZoom={onZoom}
                                        />
                                    )}
                                    scrollMode={scrollMode}
                                    viewMode={viewMode}
                                />
                            )}
                            renderError={renderError}
                            renderLoader={renderLoader}
                            renderProtectedView={renderProtectedView}
                            transformGetDocumentParams={transformGetDocumentParams}
                            withCredentials={withCredentials}
                            onDocumentAskPassword={onDocumentAskPassword}
                        />
                    )}
                </div>
            </BreakpointContext.Provider>
        </StackContext.Provider>
    );
};
