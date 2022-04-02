/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { getPage } from '@react-pdf-viewer/core';
import type { PdfJs } from '@react-pdf-viewer/core';

import { PageThumbnail } from './PageThumbnail';

interface PageState {
    height: number;
    page: PdfJs.Page | null;
    viewportRotation: number;
    width: number;
}

export const PageThumbnailContainer: React.FC<{
    canvas: HTMLCanvasElement;
    doc: PdfJs.PdfDocument;
    pageHeight: number;
    pageIndex: number;
    pageRotation: number;
    pageWidth: number;
    rotation: number;
    onLoad(): void;
}> = ({ canvas, doc, pageHeight, pageIndex, pageRotation, pageWidth, rotation, onLoad }) => {
    const [pageSize, setPageSize] = React.useState<PageState>({
        height: pageHeight,
        page: null,
        viewportRotation: 0,
        width: pageWidth,
    });
    const { page, height, width } = pageSize;
    const isVertical = Math.abs(rotation + pageRotation) % 180 === 0;

    React.useEffect(() => {
        getPage(doc, pageIndex).then((pdfPage) => {
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
    const rotationNumber = (pageSize.viewportRotation + rotation + pageRotation) % 360;

    return (
        page && (
            <PageThumbnail
                canvas={canvas}
                page={page}
                pageHeight={isVertical ? height : width}
                pageWidth={isVertical ? width : height}
                rotation={rotationNumber}
                onLoad={onLoad}
            />
        )
    );
};
