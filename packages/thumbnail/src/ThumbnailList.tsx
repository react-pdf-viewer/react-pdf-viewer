/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import {
    classNames,
    renderQueueService,
    useIsMounted,
    useIsomorphicLayoutEffect,
    TextDirection,
    ThemeContext,
} from '@react-pdf-viewer/core';
import type { PdfJs, VisibilityChanged } from '@react-pdf-viewer/core';

import { scrollToBeVisible } from './scrollToBeVisible';
import { ThumbnailContainer } from './ThumbnailContainer';
import type { RenderCurrentPageLabel } from './types/RenderCurrentPageLabelProps';
import type { RenderThumbnailItem } from './types/RenderThumbnailItemProps';

export const ThumbnailList: React.FC<{
    currentPage: number;
    doc: PdfJs.PdfDocument;
    pageHeight: number;
    pageWidth: number;
    renderCurrentPageLabel?: RenderCurrentPageLabel;
    renderThumbnailItem?: RenderThumbnailItem;
    rotation: number;
    onJumpToPage(pageIndex: number): void;
    onRotatePage(pageIndex: number, rotation: number): void;
}> = ({
    currentPage,
    doc,
    pageHeight,
    pageWidth,
    renderCurrentPageLabel,
    renderThumbnailItem,
    rotation,
    onJumpToPage,
    onRotatePage,
}) => {
    const [labels, setLabels] = React.useState([]);
    const { numPages } = doc;
    const docId = doc.loadingTask.docId;
    const numLabels = labels.length;
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const thumbnailsRef = React.useRef<HTMLElement[]>([]);
    const [currentFocused, setCurrentFocused] = React.useState(currentPage);
    const { direction } = React.useContext(ThemeContext);
    const isRtl = direction === TextDirection.RightToLeft;
    const [renderPageIndex, setRenderPageIndex] = React.useState(-1);
    const isMounted = useIsMounted();

    const pageIndexes = React.useMemo(
        () =>
            Array(numPages)
                .fill(0)
                .map((_, pageIndex) => pageIndex),
        [docId]
    );

    const renderQueueInstance = React.useMemo(
        () => renderQueueService({ doc, queueName: 'thumbnail-list', priority: 999 }),
        [docId]
    );

    React.useEffect(() => {
        doc.getPageLabels().then((result) => {
            isMounted.current && setLabels(result || []);
        });
    }, [docId]);

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
    }, []);

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
        if (container) {
            const thumbnailNodes = container.children;
            if (currentPage < thumbnailNodes.length) {
                scrollToBeVisible(thumbnailNodes.item(currentPage) as HTMLElement, container);
            }
        }
    }, [currentPage]);

    const handleRenderCompleted = React.useCallback(
        (pageIndex: number) => {
            if (isMounted.current) {
                renderQueueInstance.markRendered(pageIndex);
                renderNextThumbnail();
            }
        },
        [docId]
    );

    const handleVisibilityChanged = React.useCallback(
        (pageIndex: number, visibility: VisibilityChanged) => {
            renderQueueInstance.setVisibility(
                pageIndex,
                visibility.isVisible ? visibility.ratio : renderQueueInstance.OUT_OF_RANGE_VISIBILITY
            );
            renderNextThumbnail();
        },
        [docId]
    );

    const renderNextThumbnail = React.useCallback(() => {
        const nextPage = renderQueueInstance.getHighestPriorityPage();
        if (nextPage > -1) {
            renderQueueInstance.markRendering(nextPage);
            setRenderPageIndex(nextPage);
        }
    }, [docId]);

    React.useEffect(() => {
        return () => {
            renderQueueInstance.cleanup();
        };
    }, [docId]);

    return (
        <div
            ref={containerRef}
            data-testid="thumbnail__list"
            className={classNames({
                'rpv-thumbnail__list': true,
                'rpv-thumbnail__list--rtl': isRtl,
            })}
            onKeyDown={handleKeyDown}
        >
            {pageIndexes.map((pageIndex) => {
                // The key includes the `docId` so the thumbnail list will be re-rendered when the document changes
                const key = `${doc.loadingTask.docId}___${pageIndex}`;
                const pageLabel = numLabels === numPages ? labels[pageIndex] : `${pageIndex + 1}`;
                const label = renderCurrentPageLabel
                    ? renderCurrentPageLabel({ currentPage, pageIndex, numPages, pageLabel })
                    : pageLabel;

                const thumbnail = (
                    <ThumbnailContainer
                        doc={doc}
                        pageHeight={pageHeight}
                        pageIndex={pageIndex}
                        pageWidth={pageWidth}
                        rotation={rotation}
                        shouldRender={renderPageIndex === pageIndex}
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
                        onRotatePage: (rotation: number) => onRotatePage(pageIndex, rotation),
                    })
                ) : (
                    <div key={key}>
                        <div
                            className={classNames({
                                'rpv-thumbnail__item': true,
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
            })}
        </div>
    );
};
