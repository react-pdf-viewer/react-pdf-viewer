/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { useDebounceCallback } from '../hooks/useDebounceCallback';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
import { usePrevious } from '../hooks/usePrevious';
import { useRenderQueue } from '../hooks/useRenderQueue';
import { useRunOnce } from '../hooks/useRunOnce';
import { useTrackResize } from '../hooks/useTrackResize';
import { PageLayer } from '../layers/PageLayer';
import { LocalizationContext } from '../localization/LocalizationContext';
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
import type { SetRenderRange, VisiblePagesRange } from '../types/SetRenderRange';
import type { RotateEvent } from '../types/RotateEvent';
import type { RotatePageEvent } from '../types/RotatePageEvent';
import type { Slot } from '../types/Slot';
import type { ViewerState } from '../types/ViewerState';
import type { ZoomEvent } from '../types/ZoomEvent';
import { chunk } from '../utils/chunk';
import { classNames } from '../utils/classNames';
import { getFileExt } from '../utils/getFileExt';
import { clearPagesCache, getPage } from '../utils/managePages';
import { useVirtual } from '../virtualizer/useVirtual';
import type { VirtualItem } from '../virtualizer/VirtualItem';
import { calculateScale } from './calculateScale';
import { useDestination } from './useDestination';
import { useOutlines } from './useOutlines';
import { useFullScreen } from '../fullscreen/useFullScreen';
import { FullScreenMode } from '../structs/FullScreenMode';

const DEFAULT_PAGE_LAYOUT: PageLayout = {
    buildPageStyles: () => ({}),
    transformSize: ({ size }) => size,
};

const ZERO_OFFSET: Offset = {
    left: 0,
    top: 0,
};

export const Inner: React.FC<{
    currentFile: OpenFile;
    defaultScale?: number | SpecialZoomLevel;
    doc: PdfJs.PdfDocument;
    enableSmoothScroll: boolean;
    initialPage: number;
    initialRotation: number;
    initialScale: number;
    pageLayout?: PageLayout;
    pageSizes: PageSize[];
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
    initialPage,
    initialRotation,
    initialScale,
    pageLayout,
    pageSizes,
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

    const [rotation, setRotation] = React.useState(initialRotation);
    const previousRotation = usePrevious(rotation);

    // The rotation for each page
    const [pagesRotationChanged, setPagesRotationChanged] = React.useState(false);
    const [pagesRotation, setPagesRotation] = React.useState(new Map<number, number>());

    const [currentScrollMode, setCurrentScrollMode] = React.useState(scrollMode);
    const previousScrollMode = usePrevious(currentScrollMode);

    const [currentViewMode, setCurrentViewMode] = React.useState(viewMode);
    const previousViewMode = usePrevious(currentViewMode);

    const outlines = useOutlines(doc);

    const [scale, setScale] = React.useState(initialScale);
    const previousScale = usePrevious(scale);

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

    const sizes = React.useMemo(
        () =>
            Array(numPages)
                .fill(0)
                .map((_, pageIndex) => {
                    const pageSize = [pageSizes[pageIndex].pageHeight, pageSizes[pageIndex].pageWidth];
                    const rect: Rect =
                        Math.abs(rotation) % 180 === 0
                            ? {
                                  height: pageSize[0],
                                  width: pageSize[1],
                              }
                            : {
                                  height: pageSize[1],
                                  width: pageSize[0],
                              };
                    const pageRect = {
                        height: rect.height * scale,
                        width: rect.width * scale,
                    };
                    return layoutBuilder.transformSize({ numPages, pageIndex, size: pageRect });
                }),
        [rotation, scale]
    );

    const virtualizer = useVirtual({
        enableSmoothScroll,
        isRtl,
        numberOfItems: numPages,
        parentRef: pagesRef,
        scrollMode: currentScrollMode,
        setRenderRange,
        sizes,
        viewMode: currentViewMode,
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

    // The methods that a plugin can hook on.
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
                            pageSizes[pageIndex].pageHeight,
                            pageSizes[pageIndex].pageWidth,
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
        const degrees = direction === RotateDirection.Backward ? -90 : 90;
        const currentRotation = stateRef.current.rotation;
        const updateRotation =
            currentRotation === 360 || currentRotation === -360 ? degrees : currentRotation + degrees;

        renderQueue.markNotRendered();
        setRotation(updateRotation);
        setViewerState({
            ...stateRef.current,
            rotation: updateRotation,
        });
        onRotate({ direction, doc, rotation: updateRotation });
    }, []);

    const rotatePage = React.useCallback((pageIndex: number, direction: RotateDirection) => {
        const degrees = direction === RotateDirection.Backward ? -90 : 90;
        const rotations = stateRef.current.pagesRotation;
        const currentPageRotation = rotations.has(pageIndex) ? rotations.get(pageIndex) : initialRotation;
        const finalRotation = currentPageRotation + degrees;
        const updateRotations = rotations.set(pageIndex, finalRotation);

        setPagesRotation(updateRotations);
        // Force the pages to be re-virtualized
        setPagesRotationChanged((value) => !value);
        setViewerState({
            ...stateRef.current,
            pagesRotation: updateRotations,
            rotatedPage: pageIndex,
        });
        onRotatePage({ direction, doc, pageIndex, rotation: finalRotation });

        // Rerender the target page
        renderQueue.markRendering(pageIndex);
        setRenderPageIndex(pageIndex);
    }, []);

    const switchScrollMode = React.useCallback((scrollMode: ScrollMode) => {
        setViewerState({
            ...stateRef.current,
            scrollMode,
        });
        setCurrentScrollMode(scrollMode);
    }, []);

    const switchViewMode = React.useCallback((viewMode: ViewMode) => {
        setViewerState({
            ...stateRef.current,
            viewMode,
        });
        setCurrentViewMode(viewMode);
    }, []);

    const zoom = React.useCallback((newScale: number | SpecialZoomLevel) => {
        const pagesEle = pagesRef.current;

        const currentPage = stateRef.current.pageIndex;
        if (currentPage < 0 || currentPage >= numPages) {
            return;
        }

        const currentPageHeight = pageSizes[currentPage].pageHeight;
        const currentPageWidth = pageSizes[currentPage].pageWidth;

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
            return;
        }

        setRenderQueueKey((key) => key + 1);
        renderQueue.markNotRendered();

        setScale(updateScale);
        onZoom({ doc, scale: updateScale });

        setViewerState({
            ...stateRef.current,
            scale: updateScale,
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

    // Internal
    // --------

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

    const boundingClientRect = virtualizer.boundingClientRect;
    useRunOnce(() => {
        if (initialPage) {
            jumpToPage(initialPage);
        }
    }, boundingClientRect.height > 0 && boundingClientRect.width > 0);

    // Scroll to the current page after switching the scroll mode
    useIsomorphicLayoutEffect(() => {
        const latestPage = stateRef.current.pageIndex;
        if (latestPage > -1 && previousScrollMode !== currentScrollMode) {
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
    }, [currentScrollMode]);

    // Keep the current page after rotating the document
    useIsomorphicLayoutEffect(() => {
        const latestPage = stateRef.current.pageIndex;
        if (latestPage > -1 && previousRotation !== rotation) {
            virtualizer.scrollToItem(latestPage, ZERO_OFFSET);
        }
    }, [rotation]);

    useIsomorphicLayoutEffect(() => {
        if (previousScale != 0 && previousScale != stateRef.current.scale) {
            virtualizer.zoom(stateRef.current.scale / previousScale, stateRef.current.pageIndex).then(() => {
                if (fullScreen.fullScreenMode === FullScreenMode.EnteredCompletely) {
                    forceTargetZoomRef.current = -1;
                }
            });
        }
    }, [scale]);

    useIsomorphicLayoutEffect(() => {
        if (previousViewMode === stateRef.current.viewMode) {
            return;
        }
        const { startPage, endPage, virtualItems } = virtualizer;

        renderQueue.markNotRendered();
        renderQueue.setRange(startPage, endPage);
        for (let i = startPage; i <= endPage; i++) {
            const item = virtualItems.find((item) => item.index === i);
            if (item) {
                renderQueue.setVisibility(i, item.visibility);
            }
        }
        renderNextPage();
    }, [currentViewMode]);

    // Keep the current page after switching the viewmode
    useIsomorphicLayoutEffect(() => {
        const latestPage = stateRef.current.pageIndex;
        if (latestPage > -1 && previousViewMode !== currentViewMode) {
            virtualizer.scrollToItem(latestPage, ZERO_OFFSET);
        }
    }, [currentViewMode]);

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

        const { startPage, endPage, maxVisbilityIndex, virtualItems } = virtualizer;
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
        for (let i = startPage; i <= endPage; i++) {
            const item = virtualItems.find((item) => item.index === i);
            if (item) {
                renderQueue.setVisibility(i, item.visibility);
            }
        }

        renderNextPage();
    }, [
        virtualizer.startPage,
        virtualizer.endPage,
        virtualizer.isSmoothScrolling,
        virtualizer.maxVisbilityIndex,
        fullScreen.fullScreenMode,
        pagesRotationChanged,
        rotation,
        scale,
    ]);

    const handlePageRenderCompleted = React.useCallback(
        (pageIndex: number) => {
            renderQueue.markRendered(pageIndex);
            renderNextPage();
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

    const renderViewer = React.useCallback(() => {
        const { virtualItems } = virtualizer;
        let chunks: VirtualItem[][] = [];
        switch (currentViewMode) {
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
                        'rpv-core__inner-pages--horizontal': currentScrollMode === ScrollMode.Horizontal,
                        'rpv-core__inner-pages--rtl': isRtl,
                        'rpv-core__inner-pages--single': currentScrollMode === ScrollMode.Page,
                        'rpv-core__inner-pages--vertical': currentScrollMode === ScrollMode.Vertical,
                        'rpv-core__inner-pages--wrapped': currentScrollMode === ScrollMode.Wrapped,
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
                                '--scale-factor': scale,
                            },
                            virtualizer.getContainerStyles()
                        )}
                    >
                        {chunks.map((items) => (
                            <div
                                className={classNames({
                                    'rpv-core__inner-page-container': true,
                                    'rpv-core__inner-page-container--single': currentScrollMode === ScrollMode.Page,
                                })}
                                style={virtualizer.getItemContainerStyles(items[0])}
                                key={`${items[0].index}-${currentViewMode}`}
                            >
                                {items.map((item) => {
                                    // The first and the last items are treated as covers
                                    const isCover =
                                        currentViewMode === ViewMode.DualPageWithCover &&
                                        (item.index === 0 || (numPages % 2 === 0 && item.index === numPages - 1));
                                    return (
                                        <div
                                            aria-label={pageLabel.replace('{{pageIndex}}', `${item.index + 1}`)}
                                            className={classNames({
                                                'rpv-core__inner-page': true,
                                                'rpv-core__inner-page--dual-even':
                                                    currentViewMode === ViewMode.DualPage && item.index % 2 === 0,
                                                'rpv-core__inner-page--dual-odd':
                                                    currentViewMode === ViewMode.DualPage && item.index % 2 === 1,
                                                'rpv-core__inner-page--dual-cover': isCover,
                                                'rpv-core__inner-page--dual-cover-even':
                                                    currentViewMode === ViewMode.DualPageWithCover &&
                                                    !isCover &&
                                                    item.index % 2 === 0,
                                                'rpv-core__inner-page--dual-cover-odd':
                                                    currentViewMode === ViewMode.DualPageWithCover &&
                                                    !isCover &&
                                                    item.index % 2 === 1,
                                                'rpv-core__inner-page--single':
                                                    currentViewMode === ViewMode.SinglePage &&
                                                    currentScrollMode === ScrollMode.Page,
                                            })}
                                            role="region"
                                            key={`${item.index}-${currentViewMode}`}
                                            style={Object.assign(
                                                {},
                                                virtualizer.getItemStyles(item),
                                                layoutBuilder.buildPageStyles({
                                                    numPages,
                                                    pageIndex: item.index,
                                                    scrollMode: currentScrollMode,
                                                    viewMode: currentViewMode,
                                                })
                                            )}
                                        >
                                            <PageLayer
                                                doc={doc}
                                                measureRef={item.measureRef}
                                                outlines={outlines}
                                                pageIndex={item.index}
                                                pageRotation={
                                                    pagesRotation.has(item.index) ? pagesRotation.get(item.index) : 0
                                                }
                                                pageSize={pageSizes[item.index]}
                                                plugins={plugins}
                                                renderPage={renderPage}
                                                renderQueueKey={renderQueueKey}
                                                rotation={rotation}
                                                scale={scale}
                                                shouldRender={renderPageIndex === item.index}
                                                viewMode={currentViewMode}
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
                    pagesRotation,
                    pageSizes,
                    rotation,
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
