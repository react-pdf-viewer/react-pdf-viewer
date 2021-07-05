/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { PdfJs } from '@react-pdf-viewer/core';

import classNames from './classNames';
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

    // Scroll to the thumbnail that represents the current page
    const scrollToThumbnail = (target: HTMLElement) => {
        const container = containerRef.current;
        if (container) {
            scrollToBeVisible(target.parentElement, container);
        }
    };

    return (
        <div ref={containerRef} className="rpv-thumbnail__list">
            {Array(numPages)
                .fill(0)
                .map((_, index) => (
                    <div
                        className={classNames({
                            'rpv-thumbnail__item': true,
                            'rpv-thumbnail__item--selected': currentPage === index,
                        })}
                        key={`thumbnail-${index}`}
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
