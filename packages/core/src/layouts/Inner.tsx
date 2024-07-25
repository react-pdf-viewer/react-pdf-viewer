/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';
import { useFullScreen } from '../fullscreen/useFullScreen';
import { useAnimationFrame } from '../hooks/useAnimationFrame';
import { useDebounceCallback } from '../hooks/useDebounceCallback';
import { useRenderQueue } from '../hooks/useRenderQueue';
import { useTrackResize } from '../hooks/useTrackResize';
import { PageLayer } from '../layers/PageLayer';
import { LocalizationContext } from '../localization/LocalizationContext';
import { FullScreenMode } from '../structs/FullScreenMode';
import { RotateDirection } from '../structs/RotateDirection';
import { ScrollMode } from '../structs/ScrollMode';
import { SpecialZoomLevel } from '../structs/SpecialZoomLevel';
import { ViewMode } from '../structs/ViewMode';
import styles from '../styles/inner.module.css';
import { TextDirection, ThemeContext } from '../theme/ThemeContext';
import { type Destination } from '../types/Destination';
import { type DocumentLoadEvent } from '../types/DocumentLoadEvent';
import { type LocalizationMap } from '../types/LocalizationMap';
import { type Offset } from '../types/Offset';
import { type OpenFile } from '../types/OpenFile';
import { type PageChangeEvent } from '../types/PageChangeEvent';
import { type PageLayout } from '../types/PageLayout';
import { type PageSize } from '../types/PageSize';
import { type PdfJs } from '../types/PdfJs';
import { type Plugin } from '../types/Plugin';
import { type PluginFunctions } from '../types/PluginFunctions';
import { type Rect } from '../types/Rect';
import { type RenderPage } from '../types/RenderPage';
import { type RotateEvent } from '../types/RotateEvent';
import { type RotatePageEvent } from '../types/RotatePageEvent';
import { type SetRenderRange } from '../types/SetRenderRange';
import { type Slot } from '../types/Slot';
import { type ViewerState } from '../types/ViewerState';
import { type ZoomEvent } from '../types/ZoomEvent';
import { chunk } from '../utils/chunk';
import { classNames } from '../utils/classNames';
import { getFileExt } from '../utils/getFileExt';
import { clearPagesCache, getPage } from '../utils/managePages';
import { type VirtualItem } from '../virtualizer/VirtualItem';
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

export const Inner: React.FC<{
    currentFile: OpenFile;
    defaultScale?: number | SpecialZoomLevel;
    doc: PdfJs.PdfDocument;
    enableSmoothScroll: boolean;
    estimatedPageSizes: PageSize[];
    initialPage: number;
    initialRotation: number;
    initialScale: number;
    initialScrollMode: ScrollMode;
    initialViewMode: ViewMode;
    pageLayout?: PageLayout;
    plugins: Plugin[];
    renderPage?: RenderPage;
    setRenderRange: SetRenderRange;
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
    initialScrollMode,
    initialViewMode,
    pageLayout,
    plugins,
    renderPage,
    setRenderRange,
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
    const containerRef = React.useRef<HTMLDivElement>(null);
    const pagesRef = React.useRef<HTMLDivElement>(null);

    // Manage visited destinations
    const destinationManager = useDestination({
        getCurrentPage: () => stateRef.current.pageIndex,
    });

    // The rotation for each page
    const [pagesRotationChanged, setPagesRotationChanged] = React.useState(false);

    const outlines = useOutlines(doc);

    const stateRef = React.useRef<ViewerState>(viewerState);
    const keepSpecialZoomLevelRef = React.useRef<SpecialZoomLevel | null>(
        typeof defaultScale === 'string' ? defaultScale : null,
    );

    // Force to scroll to the target page.
    // It happens in some cases such as after users change scroll mode, view mode
    const forceTargetPageRef = React.useRef<{
        targetPage: number;
        zoomRatio: number;
    }>({
        targetPage: -1,
        zoomRatio: 1,
    });

    // Keep the special zoom level in the full-screen mode
    const forceTargetZoomRef = React.useRef(-1);

    // Force to scroll to the initial page when using the special zoom level
    const forceTargetInitialPageRef = React.useRef(initialPage);

    const fullScreen = useFullScreen({
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

    const [areSizesCalculated, setSizesCalculated] = React.useState(false);
    const [pageSizes, setPageSizes] = React.useState(estimatedPageSizes);
    const [currentPage, setCurrentPage] = React.useState(0);
    const [pagesRotation, setPagesRotation] = React.useState(new Map());
    const [rotation, setRotation] = React.useState(initialRotation);
    const [scale, setScale] = React.useState(initialScale);
    const [scrollMode, setScrollMode] = React.useState(initialScrollMode);
    const [viewMode, setViewMode] = React.useState(initialViewMode);

    /* ----- Handle actions ----- */

    const sizes = React.useMemo(
        () =>
            Array(numPages)
                .fill(0)
                .map((_, pageIndex) => {
                    const pageHeight = pageSizes[pageIndex].pageHeight;
                    const pageWidth = pageSizes[pageIndex].pageWidth;
                    const rect: Rect =
                        Math.abs(rotation) % 180 === 0
                            ? {
                                  height: pageHeight,
                                  width: pageWidth,
                              }
                            : {
                                  height: pageWidth,
                                  width: pageHeight,
                              };
                    const pageRect = {
                        height: rect.height * scale,
                        width: rect.width * scale,
                    };
                    return layoutBuilder.transformSize
                        ? layoutBuilder.transformSize({ numPages, pageIndex, size: pageRect })
                        : pageRect;
                }),
        [rotation, scale, pageSizes],
    );

    const handleVisibilityChanged = React.useCallback((pageIndex: number, visibility: number) => {
        renderQueue.setVisibility(pageIndex, visibility);
    }, []);

    const virtualizer = useVirtual({
        enableSmoothScroll,
        isRtl,
        numberOfItems: numPages,
        parentRef: pagesRef,
        scrollMode,
        setRenderRange,
        sizes,
        viewMode,
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
    // Hence, don't pass any dependencies or internal states if they use React hooks such as `useCallback()`

    const setViewerState = (viewerState: ViewerState) => {
        let newState = viewerState;

        // Loop over the plugins and notify the state changed
        const transformState = (plugin: Plugin) => {
            if (plugin.dependencies) {
                plugin.dependencies.forEach((dep) => transformState(dep));
            }
            if (plugin.onViewerStateChange) {
                newState = plugin.onViewerStateChange(newState);
            }
        };

        plugins.forEach((plugin) => transformState(plugin));
        stateRef.current = newState;
    };

    const getPagesContainer = () => pagesRef.current!;

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
        [],
    );

    const jumpToPage = React.useCallback(
        (pageIndex: number) =>
            0 <= pageIndex && pageIndex < numPages
                ? new Promise<void>((resolve) => {
                      virtualizer.scrollToItem(pageIndex, ZERO_OFFSET).then(() => {
                          setRenderPageIndex(pageIndex);
                          resolve();
                      });
                  })
                : Promise.resolve(),
        [],
    );

    const jumpToPreviousPage = React.useCallback(
        () => virtualizer.scrollToPreviousItem(stateRef.current.pageIndex, ZERO_OFFSET),
        [],
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
        [onOpenFile],
    );

    const normalizeRotation = (rotation: number): number => {
        return rotation < 0 ? 360 + rotation : rotation >= 360 ? rotation - 360 : rotation;
    };

    const rotate = React.useCallback((direction: RotateDirection) => {
        const rotation = stateRef.current.rotation;
        const degrees = direction === RotateDirection.Backward ? -90 : 90;
        const finalRotation = normalizeRotation(rotation + degrees);

        renderQueue.markNotRendered();
        setRotation(finalRotation);
        setViewerState({
            ...stateRef.current,
            rotation: finalRotation,
        });
        onRotate({ direction, doc, rotation: finalRotation });
        // Keep the current page after rotating the document
        forceTargetPageRef.current = {
            targetPage: stateRef.current.pageIndex,
            zoomRatio: 1,
        };
    }, []);

    const rotatePage = React.useCallback((pageIndex: number, direction: RotateDirection) => {
        const degrees = direction === RotateDirection.Backward ? -90 : 90;
        const rotations = stateRef.current.pagesRotation;
        const currentPageRotation = rotations.has(pageIndex) ? rotations.get(pageIndex)! : initialRotation;
        const finalRotation = normalizeRotation(currentPageRotation + degrees);
        const updateRotations = rotations.set(pageIndex, finalRotation);

        // Force the pages to be re-virtualized
        setPagesRotationChanged((value) => !value);
        setPagesRotation(updateRotations);
        setViewerState({
            ...stateRef.current,
            pagesRotation: updateRotations,
            rotatedPage: pageIndex,
        });
        onRotatePage({
            direction,
            doc,
            pageIndex,
            rotation: finalRotation,
        });

        // Rerender the target page
        renderQueue.markRendering(pageIndex);
        setRenderPageIndex(pageIndex);
    }, []);

    const switchScrollMode = React.useCallback((newScrollMode: ScrollMode) => {
        renderQueue.markNotRendered();
        setScrollMode(newScrollMode);
        setViewerState({
            ...stateRef.current,
            scrollMode: newScrollMode,
        });
        // Keep the current page after switching the scroll mode
        forceTargetPageRef.current = {
            targetPage: stateRef.current.pageIndex,
            zoomRatio: 1,
        };
    }, []);

    const switchViewMode = React.useCallback((newViewMode: ViewMode) => {
        renderQueue.markNotRendered();
        setViewMode(newViewMode);
        setViewerState({
            ...stateRef.current,
            viewMode: newViewMode,
        });
        // Keep the current page after switching the view mode
        forceTargetPageRef.current = {
            targetPage: stateRef.current.pageIndex,
            zoomRatio: 1,
        };
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
                      numPages,
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

        const previousScale = stateRef.current.scale;
        setViewerState({
            ...stateRef.current,
            scale: updateScale,
        });
        setScale(updateScale);
        onZoom({ doc, scale: updateScale });
        forceTargetPageRef.current = {
            targetPage: currentPage,
            zoomRatio: updateScale / previousScale,
        };
    }, []);

    // Full-screen mode

    const enterFullScreenMode = React.useCallback((target: HTMLElement) => {
        forceTargetPageRef.current = {
            targetPage: stateRef.current.pageIndex,
            zoomRatio: 1,
        };
        fullScreen.enterFullScreenMode(target);
    }, []);

    const exitFullScreenMode = React.useCallback(() => {
        forceTargetPageRef.current = {
            targetPage: stateRef.current.pageIndex,
            zoomRatio: 1,
        };
        fullScreen.exitFullScreenMode();
    }, []);

    React.useEffect(() => {
        setViewerState({
            ...stateRef.current,
            fullScreenMode: fullScreen.fullScreenMode,
        });
    }, [fullScreen.fullScreenMode]);

    /* ----- Internal ----- */

    const handlePageRenderCompleted = React.useCallback(
        (pageIndex: number) => {
            renderQueue.markRendered(pageIndex);
            if (areSizesCalculated) {
                return;
            }
            // Calculate page size
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
                        }),
                );
            Promise.all(queryPageSizes).then((pageSizes) => {
                setSizesCalculated(true);
                setPageSizes(pageSizes);
                if (initialPage !== 0) {
                    // Don't render the surrounded pages of the first page
                    // Jump to the initial page
                    jumpToPage(initialPage);
                }
            });
        },
        [areSizesCalculated],
    );

    const handleJumpFromLinkAnnotation = React.useCallback((destination: Destination): void => {
        destinationManager.markVisitedDestination(destination);
    }, []);

    const handleJumpToDestination = React.useCallback(
        (destination: Destination): Promise<void> => {
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
                        (typeof leftOffset === 'function' ? leftOffset(viewport.width, viewport.height) : leftOffset) ||
                        0;
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
                                numPages,
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
        },
        [pageSizes],
    );

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

        const installPlugin = (plugin: Plugin) => {
            if (plugin.dependencies) {
                plugin.dependencies.forEach((dep) => installPlugin(dep));
            }
            if (plugin.install) {
                plugin.install(pluginMethods);
            }
        };

        const uninstallPlugin = (plugin: Plugin) => {
            if (plugin.dependencies) {
                plugin.dependencies.forEach((dep) => uninstallPlugin(dep));
            }
            if (plugin.uninstall) {
                plugin.uninstall(pluginMethods);
            }
        };

        // Install the plugins
        plugins.forEach((plugin) => installPlugin(plugin));

        return () => {
            // Uninstall the plugins
            plugins.forEach((plugin) => uninstallPlugin(plugin));
        };
    }, [docId]);

    React.useEffect(() => {
        const documentLoadProps = { doc, file: currentFile };
        onDocumentLoad(documentLoadProps);

        const handleDocumentLoad = (plugin: Plugin) => {
            if (plugin.dependencies) {
                plugin.dependencies.forEach((dep) => handleDocumentLoad(dep));
            }
            if (plugin.onDocumentLoad) {
                plugin.onDocumentLoad(documentLoadProps);
            }
        };

        // Loop over the plugins
        plugins.forEach((plugin) => handleDocumentLoad(plugin));
    }, [docId]);

    React.useEffect(() => {
        if (fullScreen.fullScreenMode === FullScreenMode.Entered && keepSpecialZoomLevelRef.current) {
            forceTargetZoomRef.current = stateRef.current.pageIndex;
            zoom(keepSpecialZoomLevelRef.current);
        }
    }, [fullScreen.fullScreenMode]);

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
        const updateCurrentPage = maxVisbilityIndex;

        // Triggered when `enableSmoothScroll` is set to `false`
        const isFullScreen = fullScreen.fullScreenMode === FullScreenMode.Entered;
        if (
            isFullScreen &&
            updateCurrentPage !== forceTargetPageRef.current.targetPage &&
            forceTargetPageRef.current.targetPage > -1
        ) {
            return;
        }
        if (isFullScreen && updateCurrentPage !== forceTargetZoomRef.current && forceTargetZoomRef.current > -1) {
            return;
        }

        const previousCurrentPage = stateRef.current.pageIndex;
        setCurrentPage(updateCurrentPage);
        setViewerState({
            ...stateRef.current,
            pageIndex: updateCurrentPage,
        });
        if (updateCurrentPage !== previousCurrentPage && !virtualizer.isSmoothScrolling) {
            onPageChange({ currentPage: updateCurrentPage, doc });
        }

        // The range of pages that will be rendered
        renderQueue.setRange(startPage, endPage);
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

    const [renderNextPageInQueue] = useAnimationFrame(
        () => {
            if (
                stateRef.current.fullScreenMode === FullScreenMode.Entering ||
                stateRef.current.fullScreenMode === FullScreenMode.Exitting
            ) {
                return;
            }
            const { targetPage, zoomRatio } = forceTargetPageRef.current;
            // Scroll to the current page
            if (targetPage !== -1) {
                const promise =
                    zoomRatio === 1
                        ? // Users switch scroll mode, view mode, or rotate pages
                          jumpToPage(targetPage)
                        : // Users zoom the document
                          virtualizer.zoom(zoomRatio, targetPage);
                promise.then(() => {
                    forceTargetPageRef.current = {
                        targetPage: -1,
                        zoomRatio: 1,
                    };
                });
                return;
            }
            const nextPage = renderQueue.getHighestPriorityPage();
            if (nextPage > -1 && renderQueue.isInRange(nextPage)) {
                renderQueue.markRendering(nextPage);
                setRenderPageIndex(nextPage);
            }
        },
        true,
        [],
    );

    React.useEffect(() => {
        // Let's get started
        renderNextPageInQueue();
    }, []);

    /* ----- Renders ----- */

    const renderViewer = () => {
        const { virtualItems } = virtualizer;
        let chunks: VirtualItem[][] = [];
        switch (viewMode) {
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
                className: styles.container,
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
                        [styles.pages]: true,
                        'rpv-core__inner-pages--horizontal': scrollMode === ScrollMode.Horizontal,
                        [styles.pagesRtl]: isRtl,
                        [styles.pagesSingle]: scrollMode === ScrollMode.Page,
                        'rpv-core__inner-pages--vertical': scrollMode === ScrollMode.Vertical,
                        'rpv-core__inner-pages--wrapped': scrollMode === ScrollMode.Wrapped,
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
                            virtualizer.getContainerStyles(),
                        )}
                    >
                        {chunks.map((items) => (
                            <div
                                className={classNames({
                                    [styles.pageContainerSingle]: scrollMode === ScrollMode.Page,
                                })}
                                style={virtualizer.getItemContainerStyles(items[0])}
                                key={`${items[0].index}-${viewMode}-${scrollMode}`}
                            >
                                {items.map((item) => {
                                    // The first and the last items are treated as covers
                                    const isCover =
                                        viewMode === ViewMode.DualPageWithCover &&
                                        (item.index === 0 || (numPages % 2 === 0 && item.index === numPages - 1));
                                    return (
                                        <div
                                            aria-label={pageLabel.replace('{{pageIndex}}', `${item.index + 1}`)}
                                            className={classNames({
                                                [styles.pageDualEven]:
                                                    viewMode === ViewMode.DualPage && item.index % 2 === 0,
                                                [styles.pageDualOdd]:
                                                    viewMode === ViewMode.DualPage && item.index % 2 === 1,
                                                [styles.pageDualCover]: isCover,
                                                [styles.pageDualCoverEven]:
                                                    viewMode === ViewMode.DualPageWithCover &&
                                                    !isCover &&
                                                    item.index % 2 === 0,
                                                [styles.pageDualCoverOdd]:
                                                    viewMode === ViewMode.DualPageWithCover &&
                                                    !isCover &&
                                                    item.index % 2 === 1,
                                                [styles.pageSingle]:
                                                    viewMode === ViewMode.SinglePage && scrollMode === ScrollMode.Page,
                                            })}
                                            role="region"
                                            key={`${item.index}-${viewMode}`}
                                            style={Object.assign(
                                                {},
                                                virtualizer.getItemStyles(item),
                                                layoutBuilder.buildPageStyles
                                                    ? layoutBuilder.buildPageStyles({
                                                          numPages,
                                                          pageIndex: item.index,
                                                          scrollMode,
                                                          viewMode,
                                                      })
                                                    : {},
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
                                                viewMode={viewMode}
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

        const renderViewerProps = {
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
        };

        const transformSlot = (plugin: Plugin) => {
            if (plugin.dependencies) {
                plugin.dependencies.forEach((dep) => transformSlot(dep));
            }
            if (plugin.renderViewer) {
                slot = plugin.renderViewer({ ...renderViewerProps, slot });
            }
        };

        plugins.forEach((plugin) => transformSlot(plugin));

        return slot;
    };

    const renderSlot = React.useCallback(
        (slot: Slot) => (
            <div {...slot.attrs} style={slot.attrs && slot.attrs.style ? slot.attrs.style : {}}>
                {slot.children}
                {slot.subSlot && renderSlot(slot.subSlot)}
            </div>
        ),
        [],
    );

    return renderSlot(renderViewer());
};
