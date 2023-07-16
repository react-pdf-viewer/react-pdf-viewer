/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { useFullScreen } from '../fullscreen/useFullScreen';
import { useDebounceCallback } from '../hooks/useDebounceCallback';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
import { useRenderQueue } from '../hooks/useRenderQueue';
import { useTrackResize } from '../hooks/useTrackResize';
import { PageLayer } from '../layers/PageLayer';
import { LocalizationContext } from '../localization/LocalizationContext';
import { FullScreenMode } from '../structs/FullScreenMode';
import { RotateDirection } from '../structs/RotateDirection';
import { ScrollMode } from '../structs/ScrollMode';
import { SpecialZoomLevel } from '../structs/SpecialZoomLevel';
import { ViewMode } from '../structs/ViewMode';
import { TextDirection, ThemeContext } from '../theme/ThemeContext';
import type { Destination } from '../types/Destination';
import type { DocumentLoadEvent } from '../types/DocumentLoadEvent';
import type { LocalizationMap } from '../types/LocalizationMap';
import type { Offset } from '../types/Offset';
import type { OpenFile } from '../types/OpenFile';
import type { PageChangeEvent } from '../types/PageChangeEvent';
import type { PageLayout } from '../types/PageLayout';
import type { PageSize } from '../types/PageSize';
import type { PdfJs } from '../types/PdfJs';
import type { Plugin } from '../types/Plugin';
import type { PluginFunctions } from '../types/PluginFunctions';
import type { Rect } from '../types/Rect';
import type { RenderPage } from '../types/RenderPage';
import type { RotateEvent } from '../types/RotateEvent';
import type { RotatePageEvent } from '../types/RotatePageEvent';
import type { SetRenderRange } from '../types/SetRenderRange';
import type { Slot } from '../types/Slot';
import type { ViewerState } from '../types/ViewerState';
import type { ZoomEvent } from '../types/ZoomEvent';
import { chunk } from '../utils/chunk';
import { classNames } from '../utils/classNames';
import { getFileExt } from '../utils/getFileExt';
import { clearPagesCache, getPage } from '../utils/managePages';
import type { VirtualItem } from '../virtualizer/VirtualItem';
import { useVirtual } from '../virtualizer/useVirtual';
import { calculateScale } from './calculateScale';
import { useDestination } from './useDestination';
import { useOutlines } from './useOutlines';

const DEFAULT_PAGE_LAYOUT: PageLayout = {
    buildPageStyles: () => ({}),
    transformSize: ({ size }) => size,
};

const ZERO_OFFSET: Offset = {
    left: 0,
    top: 0,
};

enum ActionType {
    CalculatePageSizes = 'CalculatePageSizes',
    JumpToInitialPage = 'JumpToInitialPage',
    RenderNextPage = 'RenderNextPage',
    RenderPageCompleted = 'RenderPageCompleted',
    Rotate = 'Rotate',
    RotatePage = 'RotatePage',
    SwitchScrollMode = 'SwitchScrollMode',
    SwitchViewMode = 'SwitchViewMode',
    Zoom = 'Zoom',
}
type CalculatePageSizesAction = {
    actionType: typeof ActionType.CalculatePageSizes;
    renderedPageIndex: number;
};
type JumpToInitialPageAction = {
    actionType: typeof ActionType.JumpToInitialPage;
    pageSizes: PageSize[];
};
type RenderNextPageAction = {
    actionType: typeof ActionType.RenderNextPage;
    pageSizes: PageSize[];
    renderedPageIndex: number;
};
type RenderPageCompletedAction = {
    actionType: typeof ActionType.RenderPageCompleted;
    pageIndex: number;
};
type RotateAction = {
    actionType: typeof ActionType.Rotate;
    direction: RotateDirection;
};
type RotatePageAction = {
    actionType: typeof ActionType.RotatePage;
    direction: RotateDirection;
    finalRotation: number;
    pageIndex: number;
};
type SwitchScrollModeAction = {
    actionType: typeof ActionType.SwitchScrollMode;
    newScrollMode: ScrollMode;
};
type SwitchViewModeAction = {
    actionType: typeof ActionType.SwitchViewMode;
    newViewMode: ViewMode;
};
type ZoomAction = {
    actionType: typeof ActionType.Zoom;
    newScale: number | SpecialZoomLevel;
};

type ActionTypes =
    | CalculatePageSizesAction
    | JumpToInitialPageAction
    | RenderNextPageAction
    | RenderPageCompletedAction
    | RotateAction
    | RotatePageAction
    | SwitchScrollModeAction
    | SwitchViewModeAction
    | ZoomAction;

interface State {
    // Determine whether or not the sizes of all pages are calculated
    areSizesCalculated: boolean;
    nextAction?: ActionTypes;
    pagesRotation: Map<number, number>;
    pageSizes: PageSize[];
    rotation: number;
    scale: number;
    scrollMode: ScrollMode;
    viewMode: ViewMode;
}

export const Inner: React.FC<{
    currentFile: OpenFile;
    defaultScale?: number | SpecialZoomLevel;
    doc: PdfJs.PdfDocument;
    enableSmoothScroll: boolean;
    estimatedPageSizes: PageSize[];
    initialPage: number;
    initialRotation: number;
    initialScale: number;
    pageLayout?: PageLayout;
    plugins: Plugin[];
    renderPage?: RenderPage;
    scrollMode: ScrollMode;
    setRenderRange: SetRenderRange;
    viewMode: ViewMode;
    viewerState: ViewerState;
    onDocumentLoad(e: DocumentLoadEvent): void;
    onOpenFile(fileName: string, data: Uint8Array): void;
    onPageChange(e: PageChangeEvent): void;
    onRotate(e: RotateEvent): void;
    onRotatePage(e: RotatePageEvent): void;
    onZoom(e: ZoomEvent): void;
}> = ({
    currentFile,
    defaultScale,
    doc,
    enableSmoothScroll,
    estimatedPageSizes,
    initialPage,
    initialRotation,
    initialScale,
    pageLayout,
    plugins,
    renderPage,
    scrollMode,
    setRenderRange,
    viewMode,
    viewerState,
    onDocumentLoad,
    onOpenFile,
    onPageChange,
    onRotate,
    onRotatePage,
    onZoom,
}) => {
    const { numPages } = doc;
    const docId = doc.loadingTask.docId;
    const { l10n } = React.useContext(LocalizationContext);
    const themeContext = React.useContext(ThemeContext);
    const isRtl = themeContext.direction === TextDirection.RightToLeft;
    const containerRef = React.useRef<HTMLDivElement>();
    const pagesRef = React.useRef<HTMLDivElement>();
    const [currentPage, setCurrentPage] = React.useState(initialPage);

    const mostRecentVisitedRef = React.useRef(null);

    // Manage visited destinations
    const destinationManager = useDestination({
        getCurrentPage: () => stateRef.current.pageIndex,
    });

    // The rotation for each page
    const [pagesRotationChanged, setPagesRotationChanged] = React.useState(false);

    const outlines = useOutlines(doc);

    const stateRef = React.useRef<ViewerState>(viewerState);
    const keepSpecialZoomLevelRef = React.useRef<SpecialZoomLevel | null>(
        typeof defaultScale === 'string' ? defaultScale : null
    );

    // Force to scroll to the target page in the full-screen mode
    const forceTargetFullScreenRef = React.useRef(-1);

    // Keep the special zoom level in the full-screen mode
    const forceTargetZoomRef = React.useRef(-1);

    // Force to scroll to the initial page when using the special zoom level
    const forceTargetInitialPageRef = React.useRef(initialPage);

    const fullScreen = useFullScreen({
        getCurrentPage: () => stateRef.current.pageIndex,
        getCurrentScrollMode: () => stateRef.current.scrollMode,
        jumpToPage: (pageIndex: number) => jumpToPage(pageIndex),
        targetRef: pagesRef,
    });

    const [renderPageIndex, setRenderPageIndex] = React.useState(-1);
    const [renderQueueKey, setRenderQueueKey] = React.useState(0);
    const renderQueue = useRenderQueue({ doc });
    React.useEffect(() => {
        return () => {
            clearPagesCache();
        };
    }, [docId]);

    const layoutBuilder = React.useMemo(() => Object.assign({}, DEFAULT_PAGE_LAYOUT, pageLayout), []);

    const stateReducer = React.useCallback((state: State, action: ActionTypes): State => {
        switch (action.actionType) {
            case ActionType.CalculatePageSizes:
                return state;
            case ActionType.JumpToInitialPage:
                return {
                    ...state,
                    areSizesCalculated: true,
                    nextAction: action,
                    pageSizes: action.pageSizes,
                };
            case ActionType.RenderNextPage:
                return {
                    ...state,
                    areSizesCalculated: true,
                    nextAction: action,
                    pageSizes: action.pageSizes,
                };
            case ActionType.RenderPageCompleted:
                return state.areSizesCalculated
                    ? {
                          ...state,
                          nextAction: {
                              actionType: ActionType.RenderNextPage,
                              pageSizes: state.pageSizes,
                              renderedPageIndex: action.pageIndex,
                          },
                      }
                    : {
                          ...state,
                          nextAction: {
                              actionType: ActionType.CalculatePageSizes,
                              renderedPageIndex: action.pageIndex,
                          },
                      };
            case ActionType.Rotate: {
                const degrees = action.direction === RotateDirection.Backward ? -90 : 90;
                const currentRotation = state.rotation;
                const updateRotation =
                    currentRotation === 360 || currentRotation === -360 ? degrees : currentRotation + degrees;
                return {
                    ...state,
                    nextAction: action,
                    rotation: updateRotation,
                };
            }
            case ActionType.RotatePage: {
                const degrees = action.direction === RotateDirection.Backward ? -90 : 90;
                const rotations = state.pagesRotation;
                const currentPageRotation = rotations.has(action.pageIndex)
                    ? rotations.get(action.pageIndex)
                    : initialRotation;
                const finalRotation = currentPageRotation + degrees;
                const updateRotations = rotations.set(action.pageIndex, finalRotation);
                return {
                    ...state,
                    nextAction: {
                        ...action,
                        finalRotation,
                    },
                    pagesRotation: updateRotations,
                };
            }
            case ActionType.SwitchScrollMode:
                return state.scrollMode === action.newScrollMode
                    ? state
                    : {
                          ...state,
                          nextAction: action,
                          scrollMode: action.newScrollMode,
                      };
            case ActionType.SwitchViewMode:
                return state.viewMode === action.newViewMode
                    ? state
                    : {
                          ...state,
                          nextAction: action,
                          viewMode: action.newViewMode,
                      };
            case ActionType.Zoom: {
                const pagesEle = pagesRef.current;
                const newScale = action.newScale;
                const currentPage = stateRef.current.pageIndex;
                if (currentPage < 0 || currentPage >= numPages) {
                    return state;
                }

                const currentPageHeight = state.pageSizes[currentPage].pageHeight;
                const currentPageWidth = state.pageSizes[currentPage].pageWidth;

                const updateScale = pagesEle
                    ? typeof newScale === 'string'
                        ? calculateScale(
                              pagesEle,
                              currentPageHeight,
                              currentPageWidth,
                              newScale,
                              stateRef.current.viewMode,
                              numPages
                          )
                        : newScale
                    : 1;

                keepSpecialZoomLevelRef.current = typeof newScale === 'string' ? newScale : null;
                if (updateScale === stateRef.current.scale) {
                    // Prevent the case where users continue zooming
                    // when the document reaches the minimum/maximum zooming scale
                    return state;
                }
                return {
                    ...state,
                    nextAction: action,
                    scale: updateScale,
                };
            }
            default:
                return state;
        }
    }, []);

    const [state, dispatch] = React.useReducer(stateReducer, {
        areSizesCalculated: false,
        pagesRotation: new Map(),
        pageSizes: estimatedPageSizes,
        rotation: initialRotation,
        scale: initialScale,
        scrollMode,
        viewMode,
    });

    useIsomorphicLayoutEffect(() => {
        if (!state.nextAction) {
            return;
        }
        switch (state.nextAction.actionType) {
            case ActionType.CalculatePageSizes:
                calculatePageSizes(state.nextAction.renderedPageIndex);
                break;
            case ActionType.JumpToInitialPage:
                jumpToPage(initialPage);
                break;
            case ActionType.RenderNextPage:
                renderQueue.markRendered(state.nextAction.renderedPageIndex);
                renderNextPage();
                break;
            case ActionType.Rotate:
                {
                    const direction = state.nextAction.direction;
                    renderQueue.markNotRendered();
                    setViewerState({
                        ...stateRef.current,
                        rotation: state.rotation,
                    });
                    onRotate({ direction, doc, rotation: state.rotation });
                    // Keep the current page after rotating the document
                    const latestPage = stateRef.current.pageIndex;
                    if (latestPage > -1) {
                        virtualizer.scrollToItem(latestPage, ZERO_OFFSET);
                    }
                }
                break;
            case ActionType.RotatePage:
                {
                    const pageIndex = state.nextAction.pageIndex;
                    // Force the pages to be re-virtualized
                    setPagesRotationChanged((value) => !value);
                    setViewerState({
                        ...stateRef.current,
                        pagesRotation: state.pagesRotation,
                        rotatedPage: pageIndex,
                    });
                    onRotatePage({
                        direction: state.nextAction.direction,
                        doc,
                        pageIndex,
                        rotation: state.nextAction.finalRotation,
                    });

                    // Rerender the target page
                    renderQueue.markRendering(pageIndex);
                    setRenderPageIndex(pageIndex);
                }
                break;
            case ActionType.SwitchScrollMode:
                {
                    setViewerState({
                        ...stateRef.current,
                        scrollMode: state.nextAction.newScrollMode,
                    });
                    // Scroll to the current page after switching the scroll mode
                    const latestPage = stateRef.current.pageIndex;
                    if (latestPage > -1) {
                        virtualizer.scrollToItem(latestPage, ZERO_OFFSET).then(() => {
                            if (fullScreen.fullScreenMode === FullScreenMode.EnteredCompletely) {
                                // Reset the queue
                                if (!enableSmoothScroll) {
                                    renderQueue.markNotRendered();
                                }
                                forceTargetFullScreenRef.current = -1;
                            }
                        });
                    }
                }
                break;
            case ActionType.SwitchViewMode:
                {
                    renderQueue.markNotRendered();
                    setViewerState({
                        ...stateRef.current,
                        viewMode: state.nextAction.newViewMode,
                    });
                    // Keep the current page after switching the viewmode
                    const latestPage = stateRef.current.pageIndex;
                    if (latestPage > -1) {
                        virtualizer.scrollToItem(latestPage, ZERO_OFFSET);
                    }
                }
                break;
            case ActionType.Zoom:
                {
                    setRenderQueueKey((key) => key + 1);
                    renderQueue.markNotRendered();
                    const previousScale = stateRef.current.scale;
                    setViewerState({
                        ...stateRef.current,
                        scale: state.scale,
                    });
                    onZoom({ doc, scale: state.scale });
                    virtualizer.zoom(state.scale / previousScale, stateRef.current.pageIndex).then(() => {
                        if (fullScreen.fullScreenMode === FullScreenMode.EnteredCompletely) {
                            forceTargetZoomRef.current = -1;
                        }
                    });
                }
                break;
            default:
                break;
        }
    }, [state.nextAction]);

    const calculatePageSizes = (renderedPageIndex: number) => {
        const queryPageSizes = Array(doc.numPages)
            .fill(0)
            .map(
                (_, i) =>
                    new Promise<PageSize>((resolvePageSize) => {
                        getPage(doc, i).then((pdfPage) => {
                            const viewport = pdfPage.getViewport({ scale: 1 });
                            resolvePageSize({
                                pageHeight: viewport.height,
                                pageWidth: viewport.width,
                                rotation: viewport.rotation,
                            });
                        });
                    })
            );
        Promise.all(queryPageSizes).then((pageSizes) => {
            if (initialPage === 0) {
                dispatch({
                    actionType: ActionType.RenderNextPage,
                    renderedPageIndex,
                    pageSizes,
                });
            } else {
                // Don't render the surrounded pages of the first page
                // Jump to the initial page
                dispatch({
                    actionType: ActionType.JumpToInitialPage,
                    pageSizes,
                });
            }
        });
    };

    const sizes = React.useMemo(
        () =>
            Array(numPages)
                .fill(0)
                .map((_, pageIndex) => {
                    const pageHeight = state.pageSizes[pageIndex].pageHeight;
                    const pageWidth = state.pageSizes[pageIndex].pageWidth;
                    const rect: Rect =
                        Math.abs(state.rotation) % 180 === 0
                            ? {
                                  height: pageHeight,
                                  width: pageWidth,
                              }
                            : {
                                  height: pageWidth,
                                  width: pageHeight,
                              };
                    const pageRect = {
                        height: rect.height * state.scale,
                        width: rect.width * state.scale,
                    };
                    return layoutBuilder.transformSize({ numPages, pageIndex, size: pageRect });
                }),
        [state.rotation, state.scale, state.pageSizes]
    );

    const handleVisibilityChanged = React.useCallback((pageIndex: number, visibility: number) => {
        renderQueue.setVisibility(pageIndex, visibility);
    }, []);

    const virtualizer = useVirtual({
        enableSmoothScroll,
        isRtl,
        numberOfItems: numPages,
        parentRef: pagesRef,
        scrollMode: state.scrollMode,
        setRenderRange,
        sizes,
        viewMode: state.viewMode,
        onVisibilityChanged: handleVisibilityChanged,
    });

    const handlePagesResize = useDebounceCallback(() => {
        if (
            !keepSpecialZoomLevelRef.current ||
            stateRef.current.fullScreenMode !== FullScreenMode.Normal ||
            (initialPage > 0 && forceTargetInitialPageRef.current === initialPage)
        ) {
            return;
        }
        zoom(keepSpecialZoomLevelRef.current);
    }, 200);

    useTrackResize({
        targetRef: pagesRef,
        onResize: handlePagesResize,
    });

    /* ----- Plugin methods ----- */

    // The methods that a plugin can hook on
    // These methods are registered once and there is no chance for plugins to get the latest version of the methods.
    // Hence, don't pass any dependencies or internal states if they use React hooks such as React.useCallback()

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

    const jumpToDestination = React.useCallback((destination: Destination) => {
        destinationManager.markVisitedDestination(destination);
        return handleJumpToDestination(destination);
    }, []);

    const jumpToNextDestination = React.useCallback(() => {
        const nextDestination = destinationManager.getNextDestination();
        return nextDestination ? handleJumpToDestination(nextDestination) : Promise.resolve();
    }, []);

    const jumpToPreviousDestination = React.useCallback(() => {
        const lastDestination = destinationManager.getPreviousDestination();
        return lastDestination ? handleJumpToDestination(lastDestination) : Promise.resolve();
    }, []);

    const jumpToNextPage = React.useCallback(
        () => virtualizer.scrollToNextItem(stateRef.current.pageIndex, ZERO_OFFSET),
        []
    );

    const jumpToPage = React.useCallback(
        (pageIndex: number) =>
            0 <= pageIndex && pageIndex < numPages
                ? virtualizer.scrollToItem(pageIndex, ZERO_OFFSET)
                : Promise.resolve(),
        []
    );

    const jumpToPreviousPage = React.useCallback(
        () => virtualizer.scrollToPreviousItem(stateRef.current.pageIndex, ZERO_OFFSET),
        []
    );

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

    const rotate = React.useCallback((direction: RotateDirection) => {
        dispatch({
            actionType: ActionType.Rotate,
            direction,
        });
    }, []);

    const rotatePage = React.useCallback((pageIndex: number, direction: RotateDirection) => {
        dispatch({
            actionType: ActionType.RotatePage,
            direction,
            finalRotation: 0,
            pageIndex,
        });
    }, []);

    const switchScrollMode = React.useCallback((scrollMode: ScrollMode) => {
        dispatch({
            actionType: ActionType.SwitchScrollMode,
            newScrollMode: scrollMode,
        });
    }, []);

    const switchViewMode = React.useCallback((viewMode: ViewMode) => {
        dispatch({
            actionType: ActionType.SwitchViewMode,
            newViewMode: viewMode,
        });
    }, []);

    const zoom = React.useCallback((newScale: number | SpecialZoomLevel) => {
        dispatch({
            actionType: ActionType.Zoom,
            newScale: newScale,
        });
    }, []);

    // Full-screen mode

    const enterFullScreenMode = React.useCallback((target: HTMLElement) => {
        fullScreen.enterFullScreenMode(target);
    }, []);

    const exitFullScreenMode = React.useCallback(() => {
        fullScreen.exitFullScreenMode();
    }, []);

    React.useEffect(() => {
        setViewerState({
            ...stateRef.current,
            fullScreenMode: fullScreen.fullScreenMode,
        });
    }, [fullScreen.fullScreenMode]);

    /* ----- Internal ----- */

    const handleJumpFromLinkAnnotation = React.useCallback((destination: Destination): void => {
        destinationManager.markVisitedDestination(destination);
    }, []);

    const handleJumpToDestination = React.useCallback((destination: Destination): Promise<void> => {
        const { pageIndex, bottomOffset, leftOffset, scaleTo } = destination;

        const pagesContainer = pagesRef.current;
        const currentState = stateRef.current;
        if (!pagesContainer || !currentState) {
            return Promise.resolve();
        }

        return new Promise<void>((resolve, _) => {
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
                        updateScale = calculateScale(
                            pagesContainer,
                            state.pageSizes[pageIndex].pageHeight,
                            state.pageSizes[pageIndex].pageWidth,
                            SpecialZoomLevel.PageWidth,
                            viewMode,
                            numPages
                        );
                        top = (viewport.height - bottom) * updateScale;
                        left = left * updateScale;
                        zoom(updateScale);
                        break;
                    default:
                        top = (viewport.height - bottom) * updateScale;
                        left = left * updateScale;
                        break;
                }

                switch (currentState.scrollMode) {
                    case ScrollMode.Horizontal:
                        virtualizer.scrollToItem(pageIndex, { left, top: 0 }).then(() => {
                            resolve();
                        });
                        break;
                    case ScrollMode.Vertical:
                    default:
                        virtualizer.scrollToItem(pageIndex, { left: 0, top }).then(() => {
                            resolve();
                        });
                        break;
                }
            });
        });
    }, []);

    React.useEffect(() => {
        const pluginMethods: PluginFunctions = {
            enterFullScreenMode,
            exitFullScreenMode,
            getPagesContainer,
            getViewerState,
            jumpToDestination,
            jumpToNextDestination,
            jumpToPreviousDestination,
            jumpToNextPage,
            jumpToPreviousPage,
            jumpToPage,
            openFile,
            rotate,
            rotatePage,
            setViewerState,
            switchScrollMode,
            switchViewMode,
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
    }, [docId]);

    useIsomorphicLayoutEffect(() => {
        const latestPage = stateRef.current.pageIndex;
        if (
            latestPage > 0 &&
            latestPage === initialPage &&
            forceTargetInitialPageRef.current === initialPage &&
            keepSpecialZoomLevelRef.current
        ) {
            forceTargetInitialPageRef.current = -1;
            zoom(keepSpecialZoomLevelRef.current);
        }
    }, [currentPage]);

    React.useEffect(() => {
        const { isSmoothScrolling } = virtualizer;
        if (isSmoothScrolling) {
            return;
        }
        if (mostRecentVisitedRef.current === null || mostRecentVisitedRef.current !== currentPage) {
            mostRecentVisitedRef.current = currentPage;
            onPageChange({ currentPage, doc });
        }
    }, [currentPage, virtualizer.isSmoothScrolling]);

    React.useEffect(() => {
        if (fullScreen.fullScreenMode === FullScreenMode.Entering && stateRef.current.scrollMode === ScrollMode.Page) {
            forceTargetFullScreenRef.current = stateRef.current.pageIndex;
        }
        if (
            fullScreen.fullScreenMode === FullScreenMode.EnteredCompletely &&
            stateRef.current.scrollMode === ScrollMode.Page &&
            enableSmoothScroll
        ) {
            forceTargetFullScreenRef.current = -1;
        }
        if (fullScreen.fullScreenMode === FullScreenMode.EnteredCompletely && keepSpecialZoomLevelRef.current) {
            forceTargetZoomRef.current = stateRef.current.pageIndex;
            zoom(keepSpecialZoomLevelRef.current);
        }
    }, [fullScreen.fullScreenMode]);

    const handlePageRenderCompleted = React.useCallback(
        (pageIndex: number) => {
            dispatch({
                actionType: ActionType.RenderPageCompleted,
                pageIndex,
            });
        },
        [renderQueueKey]
    );

    const renderNextPage = () => {
        const nextPage = renderQueue.getHighestPriorityPage();
        if (nextPage > -1 && renderQueue.isInRange(nextPage)) {
            renderQueue.markRendering(nextPage);
            setRenderPageIndex(nextPage);
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

    // This hook should be placed at the end of hooks
    React.useEffect(() => {
        if (
            // Don't do anything if users start going to or exitting the full-screen mode
            fullScreen.fullScreenMode === FullScreenMode.Entering ||
            fullScreen.fullScreenMode === FullScreenMode.Exitting ||
            // Or smooth scrolling isn't completed yet
            virtualizer.isSmoothScrolling
        ) {
            return;
        }

        const { startPage, endPage, maxVisbilityIndex } = virtualizer;
        // The current page is the page which has the biggest visibility
        const currentPage = maxVisbilityIndex;

        const isFullScreen =
            fullScreen.fullScreenMode === FullScreenMode.Entered || // Triggered when `enableSmoothScroll` is set to `false`
            fullScreen.fullScreenMode === FullScreenMode.EnteredCompletely;
        if (isFullScreen && currentPage !== forceTargetFullScreenRef.current && forceTargetFullScreenRef.current > -1) {
            return;
        }
        if (isFullScreen && currentPage !== forceTargetZoomRef.current && forceTargetZoomRef.current > -1) {
            return;
        }

        setCurrentPage(currentPage);
        setViewerState({
            ...stateRef.current,
            pageIndex: currentPage,
        });

        // The range of pages that will be rendered
        renderQueue.setRange(startPage, endPage);
        renderNextPage();
    }, [
        virtualizer.startPage,
        virtualizer.endPage,
        virtualizer.isSmoothScrolling,
        virtualizer.maxVisbilityIndex,
        fullScreen.fullScreenMode,
        pagesRotationChanged,
        state.rotation,
        state.scale,
    ]);

    useIsomorphicLayoutEffect(() => {
        // Let's get started by rendering the first page
        renderQueue.markRendering(0);
        setRenderPageIndex(0);
    }, []);

    /* ----- Renders ----- */

    const renderViewer = React.useCallback(() => {
        const { virtualItems } = virtualizer;
        let chunks: VirtualItem[][] = [];
        switch (state.viewMode) {
            case ViewMode.DualPage:
                chunks = chunk(virtualItems, 2);
                break;
            case ViewMode.DualPageWithCover:
                if (virtualItems.length) {
                    // Does it contain the first page?
                    chunks =
                        virtualItems[0].index === 0
                            ? [[virtualItems[0]]].concat(chunk(virtualItems.slice(1), 2))
                            : chunk(virtualItems, 2);
                }
                break;
            case ViewMode.SinglePage:
            default:
                chunks = chunk(virtualItems, 1);
                break;
        }

        const pageLabel =
            l10n && l10n.core ? ((l10n.core as LocalizationMap).pageLabel as string) : 'Page {{pageIndex}}';
        let slot: Slot = {
            attrs: {
                className: 'rpv-core__inner-container',
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
                    className: classNames({
                        'rpv-core__inner-pages': true,
                        'rpv-core__inner-pages--horizontal': state.scrollMode === ScrollMode.Horizontal,
                        'rpv-core__inner-pages--rtl': isRtl,
                        'rpv-core__inner-pages--single': state.scrollMode === ScrollMode.Page,
                        'rpv-core__inner-pages--vertical': state.scrollMode === ScrollMode.Vertical,
                        'rpv-core__inner-pages--wrapped': state.scrollMode === ScrollMode.Wrapped,
                    }),
                    ref: pagesRef,
                    style: {
                        height: '100%',
                        // We need this to jump between destinations or searching results
                        position: 'relative',
                    },
                },
                children: (
                    <div
                        // It's a reliable way for e2e tests to check if the browser scroll to a particular page
                        data-testid={`core__inner-current-page-${currentPage}`}
                        style={Object.assign(
                            {
                                // From pdf-js 3.2.146, the text layer renders text items depending on the `--scale-factor` property
                                '--scale-factor': state.scale,
                            },
                            virtualizer.getContainerStyles()
                        )}
                    >
                        {chunks.map((items) => (
                            <div
                                className={classNames({
                                    'rpv-core__inner-page-container': true,
                                    'rpv-core__inner-page-container--single': state.scrollMode === ScrollMode.Page,
                                })}
                                style={virtualizer.getItemContainerStyles(items[0])}
                                key={`${items[0].index}-${state.viewMode}`}
                            >
                                {items.map((item) => {
                                    // The first and the last items are treated as covers
                                    const isCover =
                                        state.viewMode === ViewMode.DualPageWithCover &&
                                        (item.index === 0 || (numPages % 2 === 0 && item.index === numPages - 1));
                                    return (
                                        <div
                                            aria-label={pageLabel.replace('{{pageIndex}}', `${item.index + 1}`)}
                                            className={classNames({
                                                'rpv-core__inner-page': true,
                                                'rpv-core__inner-page--dual-even':
                                                    state.viewMode === ViewMode.DualPage && item.index % 2 === 0,
                                                'rpv-core__inner-page--dual-odd':
                                                    state.viewMode === ViewMode.DualPage && item.index % 2 === 1,
                                                'rpv-core__inner-page--dual-cover': isCover,
                                                'rpv-core__inner-page--dual-cover-even':
                                                    state.viewMode === ViewMode.DualPageWithCover &&
                                                    !isCover &&
                                                    item.index % 2 === 0,
                                                'rpv-core__inner-page--dual-cover-odd':
                                                    state.viewMode === ViewMode.DualPageWithCover &&
                                                    !isCover &&
                                                    item.index % 2 === 1,
                                                'rpv-core__inner-page--single':
                                                    state.viewMode === ViewMode.SinglePage &&
                                                    state.scrollMode === ScrollMode.Page,
                                            })}
                                            role="region"
                                            key={`${item.index}-${state.viewMode}`}
                                            style={Object.assign(
                                                {},
                                                virtualizer.getItemStyles(item),
                                                layoutBuilder.buildPageStyles({
                                                    numPages,
                                                    pageIndex: item.index,
                                                    scrollMode: state.scrollMode,
                                                    viewMode: state.viewMode,
                                                })
                                            )}
                                        >
                                            <PageLayer
                                                doc={doc}
                                                measureRef={item.measureRef}
                                                outlines={outlines}
                                                pageIndex={item.index}
                                                pageRotation={
                                                    state.pagesRotation.has(item.index)
                                                        ? state.pagesRotation.get(item.index)
                                                        : 0
                                                }
                                                pageSize={state.pageSizes[item.index]}
                                                plugins={plugins}
                                                renderPage={renderPage}
                                                renderQueueKey={renderQueueKey}
                                                rotation={state.rotation}
                                                scale={state.scale}
                                                shouldRender={renderPageIndex === item.index}
                                                viewMode={state.viewMode}
                                                onExecuteNamedAction={executeNamedAction}
                                                onJumpFromLinkAnnotation={handleJumpFromLinkAnnotation}
                                                onJumpToDest={jumpToDestination}
                                                onRenderCompleted={handlePageRenderCompleted}
                                                onRotatePage={rotatePage}
                                            />
                                        </div>
                                    );
                                })}
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
                    pagesContainerRef: pagesRef,
                    pagesRotation: state.pagesRotation,
                    pageSizes: state.pageSizes,
                    rotation: state.rotation,
                    slot,
                    themeContext,
                    jumpToPage,
                    openFile,
                    rotate,
                    rotatePage,
                    switchScrollMode,
                    switchViewMode,
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

    return renderSlot(renderViewer());
};
