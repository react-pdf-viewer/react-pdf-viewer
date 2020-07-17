/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { Fragment, useContext, useEffect, useRef, useState } from 'react';

import File from '../File';
import useDragScroll from '../hooks/useDragScroll';
import useDrop from '../hooks/useDrop';
import useToggle from '../hooks/useToggle';
import PageLayer from '../layers/PageLayer';
import Slot from '../layouts/Slot';
import DropArea from '../open/DropArea';
import PrintContainer from '../print/PrintContainer';
import PrintStatus from '../print/PrintStatus';
import Match from '../search/Match';
import ScrollMode from '../ScrollMode';
import SelectionMode from '../SelectionMode';
import SpecialZoomLevel from '../SpecialZoomLevel';
import ThemeContext from '../theme/ThemeContext';
import { Plugin } from '../types/Plugin';
import { PluginFunctions } from '../types/PluginFunctions';
import { ViewerState } from '../types/ViewerState';
import PdfJs from '../vendors/PdfJs';
import downloadFile from '../utils/downloadFile';
import getFileExt from '../utils/fileExt';
import { CanvasLayerRenderEvent, DocumentLoadEvent, PageChangeEvent, TextLayerRenderEvent, ZoomEvent } from '../Viewer';
import './inner.less';
import { Layout } from './Layout';
import PageSize from './PageSize';
import { RenderPage } from './RenderPage';
import Sidebar from './Sidebar';
import Toolbar from './Toolbar';
import { RenderToolbarSlot } from './ToolbarSlot';

// `new RegExp('')` will treat the source as `(?:)` which is not an empty string
const EMPTY_KEYWORD_REGEXP = new RegExp(' ');
const SCROLL_BAR_WIDTH = 17;
const PAGE_PADDING = 8;

interface InnerProps {
    defaultScale?: number | SpecialZoomLevel;
    doc: PdfJs.PdfDocument;
    file: File;
    initialPage?: number;
    keyword?: string | RegExp;
    pageSize: PageSize;
    plugins: Plugin[];
    renderPage?: RenderPage;
    selectionMode: SelectionMode;
    viewerState: ViewerState;
    onCanvasLayerRender(e: CanvasLayerRenderEvent): void;
    onDocumentLoad(e: DocumentLoadEvent): void;
    onOpenFile(fileName: string, data: Uint8Array): void;
    onPageChange(e: PageChangeEvent): void;
    onTextLayerRender(e: TextLayerRenderEvent): void;
    onZoom(e: ZoomEvent): void;
}

const Inner: React.FC<InnerProps> = ({
    defaultScale, doc, file, initialPage, keyword, pageSize, plugins, renderPage, selectionMode, viewerState,
    onCanvasLayerRender, onDocumentLoad, onOpenFile, onPageChange, onTextLayerRender, onZoom,
}) => {
    const theme = useContext(ThemeContext);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const pagesRef = useRef<HTMLDivElement | null>(null);
    const [scale, setScale] = useState(pageSize.scale);
    const [currentPage, setCurrentPage] = useState(0);
    const [rotation, setRotation] = useState(0);
    const [keywordRegexp, setKeywordRegexp] = useState<RegExp>(
        keyword
        ? ((typeof keyword === 'string') ? new RegExp(keyword) : keyword)
        : EMPTY_KEYWORD_REGEXP
    );
    const [match, setMatch] = useState<Match>({
        matchIndex: -1,
        pageIndex: -1,
    });
    const stateRef = useRef<ViewerState>(viewerState);
    const [scrollMode, setScrollMode] = useState<ScrollMode>(ScrollMode.Vertical);
    const [currentMode, setCurrentMode] = useState<SelectionMode>(selectionMode);
    const { toggleDragScroll } = useDragScroll(pagesRef);
    const toggleSidebar = useToggle();

    const { numPages } = doc;
    const { pageWidth, pageHeight } = pageSize;

    const arr = Array(numPages).fill(null);
    const pageVisibility = arr.map(() => 0);
    const pageRefs = arr.map(() => useRef<HTMLDivElement>());

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

    const getPagesRef = () => pagesRef;

    const getViewerState = () => stateRef.current;

    const getPluginMethods = (): PluginFunctions => ({
        getPagesRef,
        getViewerState,
        jumpToPage,
        setViewerState,
    });

    useEffect(() => {
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

    const openFiles = (files: FileList): void => {
        if (files.length === 0) {
            return;
        }
        const selectedFile = files[0];
        if (getFileExt(selectedFile.name).toLowerCase() !== 'pdf') {
            return;
        }
        new Promise<Uint8Array>((resolve) => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(selectedFile);
            reader.onload = (): void => {
                const bytes = new Uint8Array(reader.result as ArrayBuffer);
                resolve(bytes);
            };
        }).then((data) => {
            onOpenFile(selectedFile.name, data);
        });
    };
    const { isDragging } = useDrop(containerRef, (files) => openFiles(files));

    // Print status
    const [printStatus, setPrintStatus] = useState(PrintStatus.Inactive);

    const jumpToPage = (pageIndex: number): void => {
        if (pageIndex < 0 || pageIndex >= numPages) {
            return;
        }
        const pagesContainer = pagesRef.current;
        const targetPage = pageRefs[pageIndex].current;
        if (pagesContainer && targetPage) {
            pagesContainer.scrollTop = targetPage.offsetTop;
        }
        setCurrentPage(pageIndex);
    };

    useEffect(() => {
        onDocumentLoad({ doc });
        // Loop over the plugins
        plugins.forEach(plugin => {
            plugin.onDocumentLoad && plugin.onDocumentLoad({ doc });
        });
        if (initialPage) {
            jumpToPage(initialPage);
        }
    }, []);

    useEffect(() => {
        onPageChange({ currentPage, doc });
        setViewerState({
            file: viewerState.file,
            pageIndex: currentPage,
            scale,
        });
    }, [currentPage]);

    // Manage the selection mode
    const changeSelectionMode = (mode: SelectionMode): void => {
        toggleDragScroll(mode === SelectionMode.Hand);
        setCurrentMode(mode);
    };

    const download = (): void => {
        downloadFile(file.name, file.data);
    };

    const zoom = (newScale: number | SpecialZoomLevel): void => {
        const pagesEle = pagesRef.current;
        if (!pagesEle) {
            return;
        }

        let scaled = 1;
        switch (newScale) {
            case SpecialZoomLevel.ActualSize:
                scaled = 1;
                break;

            case SpecialZoomLevel.PageFit:
                scaled = Math.min(
                    (pagesEle.offsetWidth - SCROLL_BAR_WIDTH) / pageWidth,
                    (pagesEle.offsetHeight - 2 * PAGE_PADDING) / pageHeight
                );
                break;

            case SpecialZoomLevel.PageWidth:
                scaled = (pagesEle.offsetWidth - SCROLL_BAR_WIDTH) / pageWidth;
                break;

            default:
                scaled = newScale;
                break;
        }
        setScale(scaled);
        onZoom({ doc, scale: scaled });
    };

    useEffect(() => {
        // Toggle the drag scroll if the hand tool is set initially
        if (selectionMode === SelectionMode.Hand) {
            toggleDragScroll(true);
        }
        // If the default scale is set
        if (defaultScale) {
            zoom(defaultScale);
        }
    }, []);

    const pageVisibilityChanged = (pageIndex: number, ratio: number): void => {
        pageVisibility[pageIndex] = ratio;
        const maxRatioPage = pageVisibility.reduce((maxIndex, item, index, array) => {
            return item > array[maxIndex] ? index : maxIndex;
        }, 0);
        if (maxRatioPage !== currentPage) {
            setCurrentPage(maxRatioPage);
        }
    };

    const rotate = (degree: number): void => {
        const updateRotation = (rotation === 360 || rotation === -360) ? degree : rotation + degree;
        setRotation(updateRotation);
    };

    const changeScrollMode = (mode: ScrollMode): void => {
        const pagesContainer = pagesRef.current;
        if (!pagesContainer) {
            return;
        }
        switch (mode) {
            case ScrollMode.Vertical:
                pagesContainer.classList.add(`${theme.prefixClass}-inner-pages-vertical`);
                pagesContainer.classList.remove(`${theme.prefixClass}-inner-pages-horizontal`);
                pagesContainer.classList.remove(`${theme.prefixClass}-inner-pages-wrapped`);
                break;

            case ScrollMode.Horizontal:
                pagesContainer.classList.add(`${theme.prefixClass}-inner-pages-horizontal`);
                pagesContainer.classList.remove(`${theme.prefixClass}-inner-pages-vertical`);
                pagesContainer.classList.remove(`${theme.prefixClass}-inner-pages-wrapped`);
                break;

            case ScrollMode.Wrapped:
                pagesContainer.classList.add(`${theme.prefixClass}-inner-pages-wrapped`);
                pagesContainer.classList.remove(`${theme.prefixClass}-inner-pages-vertical`);
                pagesContainer.classList.remove(`${theme.prefixClass}-inner-pages-horizontal`);
                break;

            default:
                break;
        }
        setScrollMode(mode);
    };

    const jumpToMatch = (target: Match): void => {
        jumpToPage(target.pageIndex);
        setMatch(target);
    };

    const jumpToDest = (pageIndex: number, bottomOffset: number, scaleTo: number | SpecialZoomLevel): void => {
        const pagesContainer = pagesRef.current;
        if (!pagesContainer) {
            return;
        }

        const newPageIndex = pageIndex + 1;
        doc.getPage(newPageIndex).then((page) => {
            const viewport = page.getViewport({ scale: 1 });

            let top = 0;
            const bottom = bottomOffset || 0;
            switch (scaleTo) {
                case SpecialZoomLevel.PageFit:
                    top = 0;
                    zoom(SpecialZoomLevel.PageFit);
                    break;
                default:
                    top = (viewport.height - bottom) * scale;
                    break;
            }

            const targetPageEle = pageRefs[pageIndex].current;
            if (targetPageEle) {
                pagesContainer.scrollTop = targetPageEle.offsetTop + top;
            }
        });
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

    // Switch to the print mode
    const print = (): void => setPrintStatus(PrintStatus.Preparing);
    const cancelPrinting = (): void => setPrintStatus(PrintStatus.Inactive);
    const startPrinting = (): void => setPrintStatus(PrintStatus.Ready);

    const renderViewer = (): Slot => {
        let slot: Slot = {
            attrs: {
                ref: pagesRef,
                style: {
                    height: '100%',
                    overflow: 'auto',
                    // We need this to jump between destinations or searching results
                    position: 'relative',
                }
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
                                    doc={doc}
                                    keywordRegexp={keywordRegexp}
                                    height={pageHeight}
                                    match={match}
                                    pageIndex={index}
                                    renderPage={renderPage}
                                    rotation={rotation}
                                    scale={scale}
                                    width={pageWidth}
                                    onCanvasLayerRender={onCanvasLayerRender}
                                    onExecuteNamedAction={executeNamedAction}
                                    onJumpToDest={jumpToDest}
                                    onPageVisibilityChanged={pageVisibilityChanged}
                                    onTextLayerRender={onTextLayerRender}
                                />
                            </div>
                        );
                    })
                }
                </>
            )
        };

        plugins.forEach(plugin => {
            if (plugin.renderViewer) {
                slot = plugin.renderViewer({
                    doc,
                    slot,
                    download,
                    changeScrollMode,
                    changeSelectionMode,
                    jumpToPage,
                    print,
                    rotate,
                    zoom,
                });
            }
        });

        return slot;
    };

    const slot = renderViewer();

    return (
        <>
        <div {...slot.attrs}>
            {slot.children}
        </div>
        </>
    );
};

export default Inner;
