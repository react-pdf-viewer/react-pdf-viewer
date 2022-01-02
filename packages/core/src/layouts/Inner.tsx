/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import { useTrackResize } from '../hooks/useTrackResize';
import { useVirtual } from '../hooks/useVirtual';
import { PageLayer } from '../layers/PageLayer';
import { LocalizationContext } from '../localization/LocalizationContext';
import { SpecialZoomLevel } from '../structs/SpecialZoomLevel';
import { ThemeContext } from '../theme/ThemeContext';
import { clearPagesCache, getPage } from '../utils/managePages';
import { getFileExt } from '../utils/getFileExt';
import { maxByKey } from '../utils/maxByKey';
import { calculateScale } from './calculateScale';
import type { PageSize } from '../types/PageSize';
import type { DocumentLoadEvent } from '../types/DocumentLoadEvent';
import type { OpenFile } from '../types/OpenFile';
import type { PageChangeEvent } from '../types/PageChangeEvent';
import type { PdfJs } from '../types/PdfJs';
import type { Plugin } from '../types/Plugin';
import type { DestinationOffsetFromViewport, PluginFunctions } from '../types/PluginFunctions';
import type { RenderPage } from '../types/RenderPage';
import type { Slot } from '../types/Slot';
import type { ViewerState } from '../types/ViewerState';
import type { ZoomEvent } from '../types/ZoomEvent';

enum PageRenderStatus {
    NotRenderedYet = 'NotRenderedYet',
    Rendering = 'Rendering',
    Rendered = 'Rendered',
}

interface PageVisibility {
    pageIndex: number;
    renderStatus: PageRenderStatus;
    visibility: number;
}

const NUM_OVERSCAN_PAGES = 2;
const PAGE_PADDING = 16;

const OUT_OF_RANGE_VISIBILITY = -9999;

export const Inner: React.FC<{
    currentFile: OpenFile;
    defaultScale?: number | SpecialZoomLevel;
    doc: PdfJs.PdfDocument;
    initialPage?: number;
    pageSize: PageSize;
    plugins: Plugin[];
    renderPage?: RenderPage;
    viewerState: ViewerState;
    onDocumentLoad(e: DocumentLoadEvent): void;
    onOpenFile(fileName: string, data: Uint8Array): void;
    onPageChange(e: PageChangeEvent): void;
    onZoom(e: ZoomEvent): void;
}> = ({
    currentFile,
    defaultScale,
    doc,
    initialPage,
    pageSize,
    plugins,
    renderPage,
    viewerState,
    onDocumentLoad,
    onOpenFile,
    onPageChange,
    onZoom,
}) => {
    const { numPages } = doc;
    const docId = doc.loadingTask.docId;
    const { l10n } = React.useContext(LocalizationContext);
    const themeContext = React.useContext(ThemeContext);
    const containerRef = React.useRef<HTMLDivElement>();
    const pagesRef = React.useRef<HTMLDivElement>();
    const [currentPage, setCurrentPage] = React.useState(0);
    const [rotation, setRotation] = React.useState(0);
    const stateRef = React.useRef<ViewerState>(viewerState);
    const [scale, setScale] = React.useState(pageSize.scale);
    const keepSpecialZoomLevelRef = React.useRef<SpecialZoomLevel | null>(
        typeof defaultScale === 'string' ? defaultScale : null
    );

    const [renderPageIndex, setRenderPageIndex] = React.useState(-1);
    const getInitialPageVisibilities = React.useCallback(
        () =>
            Array(numPages)
                .fill(null)
                .map((_, pageIndex) => ({
                    pageIndex,
                    renderStatus: PageRenderStatus.NotRenderedYet,
                    visibility: OUT_OF_RANGE_VISIBILITY,
                })),
        []
    );
    const pageVisibilityRef = React.useRef<PageVisibility[]>(getInitialPageVisibilities());

    const estimateSize = React.useCallback(
        () =>
            (Math.abs(rotation) % 180 === 0 ? pageSize.pageHeight * scale : pageSize.pageWidth * scale) + PAGE_PADDING,
        [rotation, scale]
    );
    const virtualizer = useVirtual({
        estimateSize,
        numberOfItems: numPages,
        overscan: NUM_OVERSCAN_PAGES,
        parentRef: pagesRef,
    });

    React.useEffect(() => {
        // The current page is the page which has the biggest visibility
        const currentPage = maxByKey(virtualizer.virtualItems, 'visibility').index;
        setCurrentPage(currentPage);
        onPageChange({ currentPage, doc });
        setViewerState({
            file: viewerState.file,
            pageIndex: currentPage,
            pageHeight,
            pageWidth,
            rotation,
            scale,
        });

        const { startIndex, endIndex, virtualItems } = virtualizer;
        for (let i = 0; i < numPages; i++) {
            if (i < startIndex || i > endIndex) {
                pageVisibilityRef.current[i].visibility = OUT_OF_RANGE_VISIBILITY;
                pageVisibilityRef.current[i].renderStatus = PageRenderStatus.NotRenderedYet;
            } else {
                const item = virtualItems.find((item) => item.index === i);
                if (item) {
                    pageVisibilityRef.current[i].visibility = item.visibility;
                }
            }
        }
        renderNextPage();
    }, [virtualizer.virtualItems]);

    const handlePagesResize = (target: Element) => {
        if (keepSpecialZoomLevelRef.current) {
            zoom(keepSpecialZoomLevelRef.current);
        }
    };

    useTrackResize({
        targetRef: pagesRef,
        onResize: handlePagesResize,
    });

    const { pageWidth, pageHeight } = pageSize;

    // The methods that a plugin can hook on
    // -------------------------------------

    const setViewerState = (viewerState: ViewerState) => {
        let newState = viewerState;
        // Loop over the plugins and notify the state changed
        plugins.forEach((plugin) => {
            if (plugin.onViewerStateChange) {
                newState = plugin.onViewerStateChange(newState);
            }
        });
        stateRef.current = newState;
    };

    const getPagesContainer = () => pagesRef.current;

    const getViewerState = () => stateRef.current;

    const jumpToDestination = React.useCallback(
        (
            pageIndex: number,
            bottomOffset: number | DestinationOffsetFromViewport,
            leftOffset: number | DestinationOffsetFromViewport,
            scaleTo?: number | SpecialZoomLevel
        ): void => {
            const pagesContainer = pagesRef.current;
            const currentState = stateRef.current;
            if (!pagesContainer || !currentState) {
                return;
            }

            getPage(doc, pageIndex).then((page) => {
                const viewport = page.getViewport({ scale: 1 });
                let top = 0;
                const bottom =
                    (typeof bottomOffset === 'function'
                        ? bottomOffset(viewport.width, viewport.height)
                        : bottomOffset) || 0;
                let left =
                    (typeof leftOffset === 'function' ? leftOffset(viewport.width, viewport.height) : leftOffset) || 0;
                let updateScale = currentState.scale;

                switch (scaleTo) {
                    case SpecialZoomLevel.PageFit:
                        top = 0;
                        left = 0;
                        zoom(SpecialZoomLevel.PageFit);
                        break;
                    case SpecialZoomLevel.PageWidth:
                        updateScale = calculateScale(pagesContainer, pageHeight, pageWidth, SpecialZoomLevel.PageWidth);
                        top = (viewport.height - bottom) * updateScale;
                        left = left * updateScale;
                        zoom(updateScale);
                        break;
                    default:
                        const boundingRect = viewport.convertToViewportPoint(left, bottom);
                        left = Math.max(boundingRect[0] * currentState.scale, 0);
                        top = Math.max(boundingRect[1] * currentState.scale, 0);
                        break;
                }
                virtualizer.scrollToItem(pageIndex, top);
                pagesContainer.scrollLeft += left;
            });
        },
        []
    );

    const jumpToPage = React.useCallback((pageIndex: number) => {
        if (0 <= pageIndex && pageIndex < numPages) {
            virtualizer.scrollToItem(pageIndex, 0);
        }
    }, []);

    const openFile = React.useCallback(
        (file: File) => {
            if (getFileExt(file.name).toLowerCase() !== 'pdf') {
                return;
            }
            new Promise<Uint8Array>((resolve) => {
                const reader = new FileReader();
                reader.readAsArrayBuffer(file);
                reader.onload = (): void => {
                    const bytes = new Uint8Array(reader.result as ArrayBuffer);
                    resolve(bytes);
                };
            }).then((data) => {
                onOpenFile(file.name, data);
            });
        },
        [onOpenFile]
    );

    const rotate = React.useCallback((updateRotation: number) => {
        pageVisibilityRef.current = getInitialPageVisibilities();
        setRotation(updateRotation);
        setViewerState({
            file: viewerState.file,
            pageIndex: currentPage,
            pageHeight,
            pageWidth,
            rotation: updateRotation,
            scale,
        });
    }, []);

    const zoom = React.useCallback((newScale: number | SpecialZoomLevel) => {
        pageVisibilityRef.current = getInitialPageVisibilities();

        const pagesEle = pagesRef.current;
        let updateScale = pagesEle
            ? typeof newScale === 'string'
                ? calculateScale(pagesEle, pageHeight, pageWidth, newScale)
                : newScale
            : 1;

        keepSpecialZoomLevelRef.current = typeof newScale === 'string' ? newScale : null;

        // Keep the current scroll position
        pagesEle.scrollTop = (pagesEle.scrollTop * updateScale) / scale;
        pagesEle.scrollLeft = (pagesEle.scrollLeft * updateScale) / scale;

        setScale(updateScale);
        onZoom({ doc, scale: updateScale });

        setViewerState({
            file: viewerState.file,
            // Keep the current page after zooming
            pageIndex: currentPage,
            pageHeight,
            pageWidth,
            rotation,
            scale: updateScale,
        });
    }, []);

    // Internal
    // --------

    React.useEffect(() => {
        const pluginMethods: PluginFunctions = {
            getPagesContainer,
            getViewerState,
            jumpToDestination,
            jumpToPage,
            openFile,
            rotate,
            setViewerState,
            zoom,
        };

        // Install the plugins
        plugins.forEach((plugin) => {
            if (plugin.install) {
                plugin.install(pluginMethods);
            }
        });

        return () => {
            // Uninstall the plugins
            plugins.forEach((plugin) => {
                if (plugin.uninstall) {
                    plugin.uninstall(pluginMethods);
                }
            });
        };
    }, [docId]);

    React.useEffect(() => {
        onDocumentLoad({ doc, file: currentFile });
        // Loop over the plugins
        plugins.forEach((plugin) => {
            plugin.onDocumentLoad && plugin.onDocumentLoad({ doc, file: currentFile });
        });
        if (initialPage) {
            jumpToPage(initialPage);
        }
    }, [docId]);

    const handlePageRenderCompleted = React.useCallback((pageIndex: number) => {
        pageVisibilityRef.current[pageIndex].renderStatus = PageRenderStatus.Rendered;
        renderNextPage();
    }, []);

    const renderNextPage = () => {
        // Find all visible pages
        const visiblePages = pageVisibilityRef.current.filter((item) => item.visibility > OUT_OF_RANGE_VISIBILITY);
        if (!visiblePages.length) {
            return;
        }
        const firstVisiblePage = visiblePages[0].pageIndex;
        const lastVisiblePage = visiblePages[visiblePages.length - 1].pageIndex;

        // Check if there is any visible page that has been rendering
        const hasRenderingPage = visiblePages.find((item) => item.renderStatus === PageRenderStatus.Rendering);
        if (hasRenderingPage) {
            // Wait until the page is rendered completely
            return;
        }

        // Find the most visible page that isn't rendered yet
        const notRenderedPages = visiblePages
            .filter((item) => item.renderStatus === PageRenderStatus.NotRenderedYet)
            .sort((a, b) => a.visibility - b.visibility);
        if (notRenderedPages.length) {
            const nextRenderPage = notRenderedPages[notRenderedPages.length - 1].pageIndex;
            pageVisibilityRef.current[nextRenderPage].renderStatus = PageRenderStatus.Rendering;
            setRenderPageIndex(nextRenderPage);
        } else if (
            lastVisiblePage + 1 < numPages &&
            pageVisibilityRef.current[lastVisiblePage + 1].renderStatus !== PageRenderStatus.Rendered
        ) {
            // All visible pages are rendered
            // Render the page that is right after the last visible page ...
            setRenderPageIndex(lastVisiblePage + 1);
        } else if (
            firstVisiblePage - 1 >= 0 &&
            pageVisibilityRef.current[firstVisiblePage - 1].renderStatus !== PageRenderStatus.Rendered
        ) {
            // ... or before the first visible one
            setRenderPageIndex(firstVisiblePage - 1);
        }
    };

    // `action` can be `FirstPage`, `PrevPage`, `NextPage`, `LastPage`, `GoBack`, `GoForward`
    const executeNamedAction = (action: string): void => {
        const previousPage = currentPage - 1;
        const nextPage = currentPage + 1;
        switch (action) {
            case 'FirstPage':
                jumpToPage(0);
                break;
            case 'LastPage':
                jumpToPage(numPages - 1);
                break;
            case 'NextPage':
                nextPage < numPages && jumpToPage(nextPage);
                break;
            case 'PrevPage':
                previousPage >= 0 && jumpToPage(previousPage);
                break;
            default:
                break;
        }
    };

    const renderViewer = React.useCallback(() => {
        const pageLabel = (l10n && l10n.core ? l10n.core.pageLabel : 'Page {{pageIndex}}') as string;
        let slot: Slot = {
            attrs: {
                'data-testid': 'core__inner-container',
                ref: containerRef,
                style: {
                    height: '100%',
                },
            },
            children: <></>,
            subSlot: {
                attrs: {
                    'data-testid': 'core__inner-pages',
                    ref: pagesRef,
                    style: {
                        height: '100%',
                        overflow: 'auto',
                        // We need this to jump between destinations or searching results
                        position: 'relative',
                    },
                },
                children: (
                    <div
                        style={{
                            height: `${virtualizer.totalSize}px`,
                            position: 'relative',
                        }}
                    >
                        {virtualizer.virtualItems.map((item) => (
                            <div
                                aria-label={pageLabel.replace('{{pageIndex}}', `${item.index + 1}`)}
                                className="rpv-core__inner-page"
                                key={item.index}
                                role="region"
                                style={{
                                    left: 0,
                                    position: 'absolute',
                                    top: 0,
                                    height: `${item.size}px`,
                                    transform: `translateY(${item.start}px)`,
                                    width: '100%',
                                }}
                            >
                                <PageLayer
                                    doc={doc}
                                    height={pageHeight}
                                    pageIndex={item.index}
                                    plugins={plugins}
                                    renderPage={renderPage}
                                    rotation={rotation}
                                    scale={scale}
                                    shouldRender={renderPageIndex === item.index}
                                    width={pageWidth}
                                    onExecuteNamedAction={executeNamedAction}
                                    onJumpToDest={jumpToDestination}
                                    onRenderCompleted={handlePageRenderCompleted}
                                />
                            </div>
                        ))}
                    </div>
                ),
            },
        };

        plugins.forEach((plugin) => {
            if (plugin.renderViewer) {
                slot = plugin.renderViewer({
                    containerRef,
                    doc,
                    pageHeight,
                    pageWidth,
                    rotation,
                    slot,
                    themeContext,
                    jumpToPage,
                    openFile,
                    rotate,
                    zoom,
                });
            }
        });

        return slot;
    }, [plugins, virtualizer]);

    const renderSlot = React.useCallback(
        (slot: Slot) => (
            <div {...slot.attrs} style={slot.attrs && slot.attrs.style ? slot.attrs.style : {}}>
                {slot.children}
                {slot.subSlot && renderSlot(slot.subSlot)}
            </div>
        ),
        []
    );

    React.useEffect(() => {
        return () => {
            clearPagesCache();
        };
    }, []);

    return renderSlot(renderViewer());
};
