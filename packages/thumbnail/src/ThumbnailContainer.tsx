/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useState } from 'react';
import { Observer, PdfJs, Spinner, VisibilityChanged } from '@react-pdf-viewer/core';

import ThumbnailItem from './ThumbnailItem';
import './thumbnailContainer.less';

const THUMBNAIL_WIDTH = 100;

interface ThumbnailContainerProps {
    doc: PdfJs.PdfDocument;
    pageHeight: number;
    pageIndex: number;
    pageWidth: number;
    rotation: number;
}

interface PageState {
    height: number;
    isCalculated: boolean;
    page: PdfJs.Page | null;
    viewportRotation: number;
    width: number;
}

const ThumbnailContainer: React.FC<ThumbnailContainerProps> = ({ doc, pageHeight, pageIndex, pageWidth, rotation }) => {
    const [pageSize, setPageSize] = useState<PageState>({
        height: pageHeight,
        isCalculated: false,
        page: null,
        viewportRotation: 0,
        width: pageWidth,
    });
    const { isCalculated, page, height, width } = pageSize;

    const scale = width / height;
    const isVertical = Math.abs(rotation) % 180 === 0;
    const w = isVertical ? THUMBNAIL_WIDTH : (THUMBNAIL_WIDTH / scale);
    const h = isVertical ? (THUMBNAIL_WIDTH / scale) : THUMBNAIL_WIDTH;

    const onVisibilityChanged = (params: VisibilityChanged): void => {
        if (params.isVisible && !isCalculated) {
            doc.getPage(pageIndex + 1).then((pdfPage) => {
                const viewport = pdfPage.getViewport({ scale: 1 });

                setPageSize({
                    height: viewport.height,
                    isCalculated: true,
                    page: pdfPage,
                    viewportRotation: viewport.rotation,
                    width: viewport.width,
                });
            });
        }
    };

    // To support the document which is already rotated
    const rotationNumber = (rotation + pageSize.viewportRotation) % 360;

    return (
        <Observer onVisibilityChanged={onVisibilityChanged}>
            <div
                className='rpv-thumbnail-container'
                style={{
                    height: `${h}px`,
                    width: `${w}px`,
                }}
            >
                {
                    !page
                        ? <Spinner />
                        : (
                            <ThumbnailItem
                                page={page}
                                pageHeight={isVertical ? height : width}
                                pageWidth={isVertical ? width : height}
                                rotation={rotationNumber}
                                thumbnailHeight={h}
                                thumbnailWidth={w}
                            />
                        )
                }
            </div>
        </Observer>
    );
};

export default ThumbnailContainer;
