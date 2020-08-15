/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useEffect, useState } from 'react';
import { PdfJs, Spinner } from '@react-pdf-viewer/core';

import PageThumbnail from './PageThumbnail';

interface PageThumbnailContainerProps {
    doc: PdfJs.PdfDocument;
    pageHeight: number;
    pageIndex: number;
    pageWidth: number;
    rotation: number;
    onLoad(): void;
}

interface PageState {
    height: number;
    page: PdfJs.Page | null;
    viewportRotation: number;
    width: number;
}

const PageThumbnailContainer: React.FC<PageThumbnailContainerProps> = ({ doc, pageHeight, pageIndex, pageWidth, rotation, onLoad }) => {
    const [pageSize, setPageSize] = useState<PageState>({
        height: pageHeight,
        page: null,
        viewportRotation: 0,
        width: pageWidth,
    });
    const { page, height, width } = pageSize;
    const isVertical = Math.abs(rotation) % 180 === 0;

    useEffect(() => {
        doc.getPage(pageIndex + 1).then((pdfPage) => {
            const viewport = pdfPage.getViewport({ scale: 1 });

            setPageSize({
                height: viewport.height,
                page: pdfPage,
                viewportRotation: viewport.rotation,
                width: viewport.width,
            });
        });
    }, []);

    // To support the document which is already rotated
    const rotationNumber = (rotation + pageSize.viewportRotation) % 360;

    return (
        !page
            ? <Spinner />
            : (
                <PageThumbnail
                    page={page}
                    pageHeight={isVertical ? height : width}
                    pageWidth={isVertical ? width : height}
                    rotation={rotationNumber}
                    onLoad={onLoad}
                />
            )
    );
};

export default PageThumbnailContainer;
