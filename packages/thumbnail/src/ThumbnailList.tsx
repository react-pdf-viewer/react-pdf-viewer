/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { PdfJs, VisibilityChanged } from '@react-pdf-viewer/core';
import {
    chunk,
    classNames,
    RotateDirection,
    TextDirection,
    ThemeContext,
    useIsMounted,
    useIsomorphicLayoutEffect,
    usePrevious,
    useRenderQueue,
    ViewMode,
} from '@react-pdf-viewer/core';
import * as React from 'react';
import { scrollToBeVisibleHorizontally, scrollToBeVisibleVertically } from './scrollToBeVisible';
import { ThumbnailDirection } from './structs/ThumbnailDirection';
import { ThumbnailContainer } from './ThumbnailContainer';
import type { RenderCurrentPageLabel } from './types/RenderCurrentPageLabelProps';
import type { RenderThumbnailItem } from './types/RenderThumbnailItemProps';

export const ThumbnailList: React.FC<{
    currentPage: number;
    doc: PdfJs.PdfDocument;
    labels: string[];
    pagesRotation: Map<number, number>;
    pageHeight: number;
    pageWidth: number;
    renderCurrentPageLabel?: RenderCurrentPageLabel;
    renderThumbnailItem?: RenderThumbnailItem;
    rotatedPage: number;
    rotation: number;
    thumbnailDirection: ThumbnailDirection;
    thumbnailWidth: number;
    viewMode: ViewMode;
    onJumpToPage(pageIndex: number): void;
    onRotatePage(pageIndex: number, direction: RotateDirection): void;
}> = ({
    currentPage,
    doc,
    labels,
    pagesRotation,
    pageHeight,
    pageWidth,
    renderCurrentPageLabel,
    renderThumbnailItem,
    rotatedPage,
    rotation,
    thumbnailDirection,
    thumbnailWidth,
    viewMode,
    onJumpToPage,
    onRotatePage,
}) => {
    const { numPages } = doc;
    const docId = doc.loadingTask.docId;
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const thumbnailsRef = React.useRef<HTMLElement[]>([]);
    const [currentFocused, setCurrentFocused] = React.useState(currentPage);
    const { direction } = React.useContext(ThemeContext);
    const isRtl = direction === TextDirection.RightToLeft;
    const [renderPageIndex, setRenderPageIndex] = React.useState(-1);
    const isMounted = useIsMounted();
    const previousViewMode = usePrevious(viewMode);

    // To support React 18+, we need a _global_ flag to indicate that there is a thumbnail which is being rendered.
    // Without this ref, it only renders only one thumnail. Is it caused by batching in React 18?
    const hasRenderingThumbnailRef = React.useRef(false);

    const renderQueue = useRenderQueue({ doc });

    const pageIndexes = React.useMemo(
        () =>
            Array(numPages)
                .fill(0)
                .map((_, pageIndex) => pageIndex),
        [docId]
    );

    const chunks = React.useMemo(() => {
        switch (viewMode) {
            case ViewMode.DualPage:
                return chunk(pageIndexes, 2);
            case ViewMode.DualPageWithCover:
                return [[pageIndexes[0]]].concat(chunk(pageIndexes.slice(1), 2));
            case ViewMode.SinglePage:
            default:
                return chunk(pageIndexes, 1);
        }
    }, [docId, viewMode]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowDown':
                activateNextItem();
                break;

            case 'ArrowUp':
                activatePreviousItem();
                break;

            case 'Enter':
                jumpToFocusedPage();
                break;

            default:
                break;
        }
    };

    const activateNextItem = () => {
        const container = containerRef.current;
        if (!container) {
            return;
        }

        const items = thumbnailsRef.current;
        const nextItem = currentFocused + 1;

        if (nextItem < items.length) {
            if (currentFocused >= 0) {
                items[currentFocused].setAttribute('tabindex', '-1');
            }
            setCurrentFocused(nextItem);
        }
    };

    const activatePreviousItem = () => {
        const container = containerRef.current;
        if (!container) {
            return;
        }

        const items = thumbnailsRef.current;
        const prevItem = currentFocused - 1;

        if (prevItem >= 0) {
            if (currentFocused >= 0) {
                items[currentFocused].setAttribute('tabindex', '-1');
            }
            setCurrentFocused(prevItem);
        }
    };

    const jumpToFocusedPage = () => {
        if (currentFocused >= 0 && currentFocused < numPages) {
            onJumpToPage(currentFocused);
        }
    };

    useIsomorphicLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }

        // Cache thumbnail elements
        thumbnailsRef.current = Array.from(container.querySelectorAll('.rpv-thumbnail__item'));
    }, [viewMode]);

    React.useEffect(() => {
        const thumbnails = thumbnailsRef.current;
        if (thumbnails.length === 0 || currentFocused < 0 || currentFocused > thumbnails.length) {
            return;
        }

        const thumbnailEle = thumbnails[currentFocused];
        thumbnailEle.setAttribute('tabindex', '0');
        thumbnailEle.focus();
    }, [currentFocused]);

    useIsomorphicLayoutEffect(() => {
        // Scroll to the thumbnail that represents the current page
        const container = containerRef.current;
        const thumbnails = thumbnailsRef.current;
        if (!container || thumbnails.length === 0 || currentPage < 0 || currentPage > thumbnails.length) {
            return;
        }

        const thumbnailContainer = thumbnails[currentPage].closest('.rpv-thumbnail__items');
        if (thumbnailContainer) {
            thumbnailDirection === ThumbnailDirection.Vertical
                ? scrollToBeVisibleVertically(thumbnailContainer as HTMLElement, container)
                : scrollToBeVisibleHorizontally(thumbnailContainer as HTMLElement, container);
        }
    }, [currentPage, thumbnailDirection]);

    const handleRenderCompleted = React.useCallback(
        (pageIndex: number) => {
            if (isMounted.current) {
                renderQueue.markRendered(pageIndex);
                hasRenderingThumbnailRef.current = false;
                renderNextThumbnail();
            }
        },
        [docId]
    );

    const handleVisibilityChanged = React.useCallback(
        (pageIndex: number, visibility: VisibilityChanged) => {
            visibility.isVisible
                ? renderQueue.setVisibility(pageIndex, visibility.ratio)
                : // Notice that we don't virtualize the list of thumbnails
                  renderQueue.setOutOfRange(pageIndex);
            renderNextThumbnail();
        },
        [docId]
    );

    const renderNextThumbnail = React.useCallback(() => {
        if (hasRenderingThumbnailRef.current) {
            return;
        }

        const nextPage = renderQueue.getHighestPriorityPage();
        if (nextPage > -1) {
            renderQueue.markRendering(nextPage);
            hasRenderingThumbnailRef.current = true;
            setRenderPageIndex(nextPage);
        }
    }, [docId]);

    // Re-render the thumbnail of page which has just been rotated
    React.useEffect(() => {
        if (rotatedPage >= 0) {
            renderQueue.markRendering(rotatedPage);
            hasRenderingThumbnailRef.current = true;
            setRenderPageIndex(rotatedPage);
        }
    }, [docId, rotatedPage]);

    // Re-render thumbnails when users change the viewmode
    useIsomorphicLayoutEffect(() => {
        if (previousViewMode !== viewMode) {
            renderQueue.markNotRendered();
            renderNextThumbnail();
        }
    }, [viewMode]);

    const renderPageThumbnail = (pageIndex: number) => {
        const isCover =
            viewMode === ViewMode.DualPageWithCover &&
            (pageIndex === 0 || (numPages % 2 === 0 && pageIndex === numPages - 1));
        // The key includes the `docId` so the thumbnail list will be re-rendered when the document changes
        const key = `${doc.loadingTask.docId}___${pageIndex}`;
        const pageLabel = labels.length === numPages ? labels[pageIndex] : `${pageIndex + 1}`;
        const label = renderCurrentPageLabel
            ? renderCurrentPageLabel({ currentPage, pageIndex, numPages, pageLabel })
            : pageLabel;

        const pageRotation = pagesRotation.has(pageIndex) ? pagesRotation.get(pageIndex) : 0;

        const thumbnail = (
            <ThumbnailContainer
                doc={doc}
                pageHeight={pageHeight}
                pageIndex={pageIndex}
                pageRotation={pageRotation}
                pageWidth={pageWidth}
                rotation={rotation}
                shouldRender={renderPageIndex === pageIndex}
                thumbnailWidth={thumbnailWidth}
                onRenderCompleted={handleRenderCompleted}
                onVisibilityChanged={handleVisibilityChanged}
            />
        );

        return renderThumbnailItem ? (
            renderThumbnailItem({
                currentPage,
                key,
                numPages,
                pageIndex,
                renderPageLabel: <>{label}</>,
                renderPageThumbnail: thumbnail,
                onJumpToPage: () => onJumpToPage(pageIndex),
                onRotatePage: (direction: RotateDirection) => onRotatePage(pageIndex, direction),
            })
        ) : (
            <div key={key}>
                <div
                    className={classNames({
                        'rpv-thumbnail__item': true,
                        'rpv-thumbnail__item--dual-even': viewMode === ViewMode.DualPage && pageIndex % 2 === 0,
                        'rpv-thumbnail__item--dual-odd': viewMode === ViewMode.DualPage && pageIndex % 2 === 1,
                        'rpv-thumbnail__item--dual-cover': isCover,
                        'rpv-thumbnail__item--dual-cover-even':
                            viewMode === ViewMode.DualPageWithCover && !isCover && pageIndex % 2 === 0,
                        'rpv-thumbnail__item--dual-cover-odd':
                            viewMode === ViewMode.DualPageWithCover && !isCover && pageIndex % 2 === 1,
                        'rpv-thumbnail__item--single': viewMode === ViewMode.SinglePage,
                        'rpv-thumbnail__item--selected': currentPage === pageIndex,
                    })}
                    role="button"
                    tabIndex={currentPage === pageIndex ? 0 : -1}
                    onClick={() => onJumpToPage(pageIndex)}
                >
                    {thumbnail}
                </div>
                <div data-testid={`thumbnail__label-${pageIndex}`} className="rpv-thumbnail__label">
                    {label}
                </div>
            </div>
        );
    };

    return (
        <div
            ref={containerRef}
            data-testid="thumbnail__list"
            className={classNames({
                'rpv-thumbnail__list': true,
                'rpv-thumbnail__list--horizontal': thumbnailDirection === ThumbnailDirection.Horizontal,
                'rpv-thumbnail__list--rtl': isRtl,
                'rpv-thumbnail__list--vertical': thumbnailDirection === ThumbnailDirection.Vertical,
            })}
            onKeyDown={handleKeyDown}
        >
            {chunks.map((chunkItem, index) => {
                let isSelectedChunk = false;
                switch (viewMode) {
                    case ViewMode.DualPage:
                        isSelectedChunk = currentPage === 2 * index || currentPage === 2 * index + 1;
                        break;

                    case ViewMode.DualPageWithCover:
                        isSelectedChunk =
                            // The first page
                            (currentPage === 0 && index === 0) ||
                            (index > 0 && currentPage === 2 * index - 1) ||
                            (index > 0 && currentPage === 2 * index);
                        break;

                    case ViewMode.SinglePage:
                    default:
                        isSelectedChunk = currentPage === index;
                        break;
                }

                return (
                    <div
                        className={classNames({
                            'rpv-thumbnail__items': true,
                            'rpv-thumbnail__items--dual': viewMode === ViewMode.DualPage,
                            'rpv-thumbnail__items--dual-cover': viewMode === ViewMode.DualPageWithCover,
                            'rpv-thumbnail__items--single': viewMode === ViewMode.SinglePage,
                            'rpv-thumbnail__items--selected': isSelectedChunk,
                        })}
                        key={`${index}___${viewMode}`}
                    >
                        {chunkItem.map((pageIndex) => renderPageThumbnail(pageIndex))}
                    </div>
                );
            })}
        </div>
    );
};
