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
    currentPage, doc, pageHeight, pageWidth, rotation, onJumpToPage,
}) => {
    const { numPages } = doc;
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    const scrollToThumbnail = (target: HTMLElement) => {
        const container = containerRef.current;
        if (!container) {
            return;
        }

        // Scroll to the thumbnail that represents the current page
        container.scrollTop = target.offsetTop;
        container.scrollLeft = target.offsetLeft;
    };

    return (
        <div
            ref={containerRef}
            className='rpv-thumbnail-list'
        >
        {
            Array(numPages).fill(0).map((_, index) => (
                <div
                    key={`thumbnail-${index}`}
                    onClick={() => onJumpToPage(index)}
                >
                    <div
                        className={
                            classNames({
                                ['rpv-thumbnail-item']: true,
                                ['rpv-thumbnail-item-selected']: currentPage === index,
                            })
                        }
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
                </div>
            ))
        }
        </div>
    );
};

export default ThumbnailList;
