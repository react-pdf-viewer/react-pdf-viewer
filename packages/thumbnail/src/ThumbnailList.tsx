/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { classNames, PdfJs, useIsomorphicLayoutEffect } from '@react-pdf-viewer/core';

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
        const currentIndex = items.findIndex((item) => item.getAttribute('tabindex') === '0');
        const nextItem = currentIndex + 1;

        if (nextItem < items.length) {
            if (currentIndex >= 0) {
                items[currentIndex].setAttribute('tabindex', '-1');
            }

            items[nextItem].setAttribute('tabindex', '0');
            items[nextItem].focus();
        }
    };

    const activatePreviousItem = () => {
        const container = containerRef.current;
        if (!container) {
            return;
        }

        const items = thumbnailsRef.current;
        const currentIndex = items.findIndex((item) => item.getAttribute('tabindex') === '0');
        const prevItem = currentIndex - 1;

        if (prevItem >= 0) {
            if (currentIndex >= 0) {
                items[currentIndex].setAttribute('tabindex', '-1');
            }

            items[prevItem].setAttribute('tabindex', '0');
            items[prevItem].focus();
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
