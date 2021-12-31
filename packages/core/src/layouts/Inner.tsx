/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
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

const NUM_OVERSCAN_PAGES = 2;
const PAGE_PADDING = 16;

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

    const estimateSize = React.useCallback(
        () => (Math.abs(rotation) % 180 === 0 ? pageSize.pageHeight * scale : pageSize.pageWidth * scale) + PAGE_PADDING,
        [rotation, scale]
    );
    const virtualizer = useVirtual({
        estimateSize,
        numberOfItems: numPages,
        overscan: NUM_OVERSCAN_PAGES,
        parentRef: pagesRef,
    });
    const [pageStatus, setPageStatus] = React.useState({
        pageIndex: -1,
        renderStatus: PageRenderStatus.NotRenderedYet,
    });

    React.useEffect(() => {
        // The current page is the page which has the biggest visibility
        setCurrentPage(virtualizer.maxVisibilityIndex);
    }, [virtualizer.maxVisibilityIndex]);

    const pageStatusesRef = React.useRef<Map<number, PageRenderStatus>>(new Map());

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

    const jumpToDestination = (
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
                (typeof bottomOffset === 'function' ? bottomOffset(viewport.width, viewport.height) : bottomOffset) ||
                0;
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
    };

    const jumpToPage = (pageIndex: number): void => {
        if (0 <= pageIndex && pageIndex < numPages) {
            virtualizer.scrollToItem(pageIndex, 0);
        }
    };

    const openFile = (file: File): void => {
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
    };

    const rotate = (updateRotation: number): void => {
        pageStatusesRef.current.clear();
        setRotation(updateRotation);
        setViewerState({
            file: viewerState.file,
            pageIndex: currentPage,
            pageHeight,
            pageWidth,
            rotation: updateRotation,
            scale,
        });
    };

    const zoom = (newScale: number | SpecialZoomLevel): void => {
        pageStatusesRef.current.clear();

        const pagesEle = pagesRef.current;
        let updateScale = pagesEle
            ? typeof newScale === 'string'
                ? calculateScale(pagesEle, pageHeight, pageWidth, newScale)
                : newScale
            : 1;

        keepSpecialZoomLevelRef.current = typeof newScale === 'string' ? newScale : null;

        setScale(updateScale);
        onZoom({ doc, scale: updateScale });
    };

    React.useEffect(() => {
        const pagesEle = pagesRef.current;
        const currentState = stateRef.current;
        if (!pagesEle || !currentState) {
            return;
        }

        // Keep the current scroll position
        pagesEle.scrollTop = (pagesEle.scrollTop * scale) / currentState.scale;
        pagesEle.scrollLeft = (pagesEle.scrollLeft * scale) / currentState.scale;

        setViewerState({
            file: viewerState.file,
            // Keep the current page after zooming
            pageIndex: currentState.pageIndex,
            pageHeight,
            pageWidth,
            rotation,
            scale: scale,
        });
    }, [scale]);

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

    React.useEffect(() => {
        onPageChange({ currentPage, doc });
        setViewerState({
            file: viewerState.file,
            pageIndex: currentPage,
            pageHeight,
            pageWidth,
            rotation,
            scale,
        });
    }, [currentPage]);

    React.useEffect(() => {
        const startPage = virtualizer.virtualItems[0].index;
        const endPage = startPage + virtualizer.virtualItems.length;

        // Reset the statuses for pages that are not in the range
        pageStatusesRef.current.forEach((_, pageIndex) => {
            if (pageIndex < startPage || pageIndex > endPage) {
                pageStatusesRef.current.delete(pageIndex);
            }
        });

        switch (pageStatus.renderStatus) {
            case PageRenderStatus.Rendering:
                if (!pageStatusesRef.current.has(pageStatus.pageIndex)) {
                    pageStatusesRef.current.set(startPage, PageRenderStatus.Rendering);
                    setPageStatus({
                        pageIndex: startPage,
                        renderStatus: PageRenderStatus.Rendering,
                    });
                }
                break;

            case PageRenderStatus.Rendered:
                // The current rendering is done
                // Find the next page in the range which isn't rendered yet
                for (let i = startPage; i < endPage; i++) {
                    if (!pageStatusesRef.current.has(i)) {
                        pageStatusesRef.current.set(i, PageRenderStatus.Rendering);
                        setPageStatus({
                            pageIndex: i,
                            renderStatus: PageRenderStatus.Rendering,
                        });
                        break;
                    }
                }
                break;

            case PageRenderStatus.NotRenderedYet:
            default:
                // If there is no rendered page, then start with the `startPage`
                pageStatusesRef.current.set(startPage, PageRenderStatus.Rendering);
                setPageStatus({
                    pageIndex: startPage,
                    renderStatus: PageRenderStatus.Rendering,
                });
                break;
        }
    }, [virtualizer, pageStatus]);

    const handlePageRenderCompleted = React.useCallback((pageIndex: number): void => {
        setPageStatus({
            pageIndex,
            renderStatus: PageRenderStatus.Rendered,
        });
        pageStatusesRef.current.set(pageIndex, PageRenderStatus.Rendered);
    }, []);

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

    const pageLabel = (l10n && l10n.core ? l10n.core.pageLabel : 'Page {{pageIndex}}') as string;

    const renderViewer = React.useCallback(() => {
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
                                    shouldRender={pageStatus.pageIndex === item.index}
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
    }, [plugins, virtualizer.virtualItems]);

    const renderSlot = React.useCallback((slot: Slot) => (
        <div {...slot.attrs} style={slot.attrs && slot.attrs.style ? slot.attrs.style : {}}>
            {slot.children}
            {slot.subSlot && renderSlot(slot.subSlot)}
        </div>
    ), []);

    React.useEffect(() => {
        return () => {
            clearPagesCache();
            // Clear the maps
            pageStatusesRef.current.clear();
        };
    }, []);

    return renderSlot(renderViewer());
};
