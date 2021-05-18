/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import PageLayer from '../layers/PageLayer';
import Slot from '../layouts/Slot';
import SpecialZoomLevel from '../SpecialZoomLevel';
import ThemeContext from '../theme/ThemeContext';
import { Plugin } from '../types/Plugin';
import PluginFunctions from '../types/PluginFunctions';
import ViewerState from '../types/ViewerState';
import PdfJs from '../vendors/PdfJs';
import getFileExt from '../utils/fileExt';
import { DocumentLoadEvent, PageChangeEvent, ZoomEvent } from '../Viewer';
import calculateScale from './calculateScale';
import PageSize from './PageSize';
import { RenderPage } from './RenderPage';

const SCROLL_BAR_WIDTH = 17;
const PAGE_PADDING = 8;

interface InnerProps {
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
}

const Inner: React.FC<InnerProps> = ({
    doc, initialPage, pageSize, plugins, renderPage, viewerState,
    onDocumentLoad, onOpenFile, onPageChange, onZoom,
}) => {
    const theme = React.useContext(ThemeContext);
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const pagesRef = React.useRef<HTMLDivElement | null>(null);    
    const [currentPage, setCurrentPage] = React.useState(0);
    const [rotation, setRotation] = React.useState(0);
    const stateRef = React.useRef<ViewerState>(viewerState);
    const [scale, setScale] = React.useState(pageSize.scale);

    const { numPages } = doc;
    const { pageWidth, pageHeight } = pageSize;

    const arr = Array(numPages).fill(null);
    const pageVisibility = arr.map(() => 0);
    const pageRefs = arr.map(() => React.useRef<HTMLDivElement>());

    // -------------------------------------
    // The methods that a plugin can hook on
    // -------------------------------------

    const setViewerState = (viewerState: ViewerState) => {
        let newState = viewerState;
        // Loop over the plugins and notify the state changed
        plugins.forEach(plugin => {
            if (plugin.onViewerStateChange) {
                newState = plugin.onViewerStateChange(newState);
            }
        });
        stateRef.current = newState;
    };

    const getPagesContainer = () => pagesRef.current;

    const getPageElement = (pageIndex: number): HTMLElement | null => {
        if (pageIndex < 0 || pageIndex >= numPages) {
            return null;
        }
        return pageRefs[pageIndex].current;
    };

    const getViewerState = () => stateRef.current;

    const jumpToDestination = (pageIndex: number, bottomOffset: number, leftOffset: number, scaleTo: number | SpecialZoomLevel): void => {
        const pagesContainer = pagesRef.current;
        const currentState = stateRef.current;
        if (!pagesContainer || !currentState) {
            return;
        }

        const newPageIndex = pageIndex + 1;
        doc.getPage(newPageIndex).then((page) => {
            const viewport = page.getViewport({ scale: 1 });

            let top = 0;
            const bottom = bottomOffset || 0;
            let left = leftOffset || 0;
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
                    top = (viewport.height - bottom) * currentState.scale;
                    left = left * currentState.scale;
                    break;
            }

            const targetPageEle = pageRefs[pageIndex].current;
            if (targetPageEle) {
                pagesContainer.scrollTop = targetPageEle.offsetTop + top;
                pagesContainer.scrollLeft = targetPageEle.offsetLeft + left;
            }
        });
    };

    const jumpToPage = (pageIndex: number): void => {
        if (pageIndex < 0 || pageIndex >= numPages) {
            return;
        }
        const pagesContainer = pagesRef.current;
        const targetPage = pageRefs[pageIndex].current;
        if (pagesContainer && targetPage) {
            pagesContainer.scrollTop = targetPage.offsetTop;
            pagesContainer.scrollLeft = targetPage.offsetLeft;
        }
        setCurrentPage(pageIndex);
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
        const pagesEle = pagesRef.current;
        let updateScale = pagesEle
                            ? (typeof newScale === 'string' ? calculateScale(pagesEle, pageHeight, pageWidth, newScale) : newScale)
                            : 1;
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
        pagesEle.scrollTop = pagesEle.scrollTop * scale / currentState.scale;
        pagesEle.scrollLeft = pagesEle.scrollLeft * scale / currentState.scale;
        
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

    // Important rule: All the plugin methods can't use the internal state (`currentPage`, `rotation`, `scale`, for example).
    // These methods when being called from plugins will use the initial value of state, not the latest one.
    // If you want to access internal state from plugin methods, use `stateRef`
    const getPluginMethods = (): PluginFunctions => ({
        getPageElement,
        getPagesContainer,
        getViewerState,
        jumpToDestination,
        jumpToPage,
        openFile,
        rotate,
        setViewerState,
        zoom,
    });

    React.useEffect(() => {
        const pluginMethods = getPluginMethods();

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
    }, []);

    React.useEffect(() => {
        onDocumentLoad({ doc });
        // Loop over the plugins
        plugins.forEach(plugin => {
            plugin.onDocumentLoad && plugin.onDocumentLoad({ doc });
        });
        if (initialPage) {
            jumpToPage(initialPage);
        }
    }, []);

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

    const pageVisibilityChanged = (pageIndex: number, ratio: number): void => {
        pageVisibility[pageIndex] = ratio;
        const maxRatioPage = pageVisibility.reduce((maxIndex, item, index, array) => {
            return item > array[maxIndex] ? index : maxIndex;
        }, 0);
        setCurrentPage(maxRatioPage);
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
                (nextPage < numPages) && jumpToPage(nextPage);
                break;
            case 'PrevPage':
                (previousPage >= 0) && jumpToPage(previousPage);
                break;
            default:
                break;
        }
    };

    const renderViewer = (): Slot => {
        let slot: Slot = {
            attrs: {
                ref: containerRef,
                style: {
                    height: '100%',
                },
            },
            children: <></>,
            subSlot: {
                attrs: {
                    ref: pagesRef,
                    style: {
                        height: '100%',
                        overflow: 'auto',
                        // We need this to jump between destinations or searching results
                        position: 'relative',
                    },
                },
                children: (
                    <>
                    {
                        Array(numPages).fill(0).map((_, index) => {
                            return (
                                <div
                                    className={`${theme.prefixClass}-inner-page`}
                                    key={`pagelayer-${index}`}
                                    ref={(ref): void => {
                                        pageRefs[index].current = ref as HTMLDivElement;
                                    }}
                                >
                                    <PageLayer
                                        currentPage={currentPage}
                                        doc={doc}
                                        height={pageHeight}
                                        pageIndex={index}
                                        plugins={plugins}
                                        renderPage={renderPage}
                                        rotation={rotation}
                                        scale={scale}
                                        width={pageWidth}
                                        onExecuteNamedAction={executeNamedAction}
                                        onJumpToDest={jumpToDestination}
                                        onPageVisibilityChanged={pageVisibilityChanged}
                                    />
                                </div>
                            );
                        })
                    }
                    </>
                ),
            },
        };

        plugins.forEach(plugin => {
            if (plugin.renderViewer) {
                slot = plugin.renderViewer({
                    containerRef,
                    doc,
                    pageHeight,
                    pageWidth,
                    rotation,
                    slot,
                    jumpToPage,
                    openFile,
                    rotate,
                    zoom,
                });
            }
        });

        return slot;
    };

    const renderSlot = (slot: Slot) => (
        <div {...slot.attrs} style={slot.attrs && slot.attrs.style ? slot.attrs.style : {}}>
            {slot.children}
            {slot.subSlot && renderSlot(slot.subSlot)}
        </div>
    );

    return renderSlot(renderViewer());
};

export default Inner;
