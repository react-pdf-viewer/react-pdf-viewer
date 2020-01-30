/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import PdfJs from '../PdfJs';
import ThumbnailContainer from './ThumbnailContainer';
import './thumbnailList.css';

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
        <>
            {
                Array(numPages).fill(0).map((_, index) => {
                    const onClick = () => onJumpToPage(index);
                    return (
                        <div key={`thumbnail-${index}`}>
                            <div
                                className={
                                    currentPage === index ? 'viewer-thumbnail-selected' : 'viewer-thumbnail'
                                }
                                style={{
                                    padding: '8px',
                                }}
                                onClick={onClick}
                            >
                                <ThumbnailContainer
                                    doc={doc}
                                    pageHeight={pageHeight}
                                    pageIndex={index}
                                    pageWidth={pageWidth}
                                    rotation={rotation}
                                />
                            </div>
                        </div>
                    );
                })
            }
        </>
    );
};

export default ThumbnailList;
