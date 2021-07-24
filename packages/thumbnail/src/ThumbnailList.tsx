/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { classNames, useIsomorphicLayoutEffect } from '@react-pdf-viewer/core';
import type { PdfJs } from '@react-pdf-viewer/core/lib';

import scrollToBeVisible from './scrollToBeVisible';
import ThumbnailContainer from './ThumbnailContainer';

interface ThumbnailListProps {
    currentPage: number;
    doc: PdfJs.PdfDocument;
    pageHeight: number;
    pageWidth: number;
    rotation: number;
    onJumpToPage(pageIndex: number): void;
}

const ThumbnailList: React.FC<ThumbnailListProps> = ({
    currentPage,
    doc,
    pageHeight,
    pageWidth,
    rotation,
    onJumpToPage,
}) => {
    const { numPages } = doc;
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const thumbnailsRef = React.useRef<HTMLElement[]>([]);
    const [currentFocused, setCurrentFocused] = React.useState(currentPage);

    // Scroll to the thumbnail that represents the current page
    const scrollToThumbnail = (target: HTMLElement) => {
        const container = containerRef.current;
        if (container) {
            scrollToBeVisible(target.parentElement, container);
        }
    };

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

    return (
        <div ref={containerRef} className="rpv-thumbnail__list" onKeyDown={handleKeyDown}>
            {Array(numPages)
                .fill(0)
                .map((_, index) => (
                    <div
                        className={classNames({
                            'rpv-thumbnail__item': true,
                            'rpv-thumbnail__item--selected': currentPage === index,
                        })}
                        key={`thumbnail-${index}`}
                        role="button"
                        tabIndex={currentPage === index ? 0 : -1}
                        onClick={() => onJumpToPage(index)}
                    >
                        <ThumbnailContainer
                            doc={doc}
                            isActive={currentPage === index}
                            pageHeight={pageHeight}
                            pageIndex={index}
                            pageWidth={pageWidth}
                            rotation={rotation}
                            onActive={scrollToThumbnail}
                        />
                    </div>
                ))}
        </div>
    );
};

export default ThumbnailList;
