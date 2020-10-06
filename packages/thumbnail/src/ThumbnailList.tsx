/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';
import { PdfJs } from '@react-pdf-viewer/core';

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
    return (
        <div className='rpv-thumbnail-list'>
            {
                Array(numPages).fill(0).map((_, index) => {
                    return (
                        <div
                            key={`thumbnail-${index}`}
                            className='rpv-thumbnail-item'
                            onClick={() => onJumpToPage(index)}
                        >
                            <ThumbnailContainer
                                doc={doc}
                                isSelected={currentPage === index}
                                pageHeight={pageHeight}
                                pageIndex={index}
                                pageWidth={pageWidth}
                                rotation={rotation}
                            />
                        </div>
                    );
                })
            }
        </div>
    );
};

export default ThumbnailList;
