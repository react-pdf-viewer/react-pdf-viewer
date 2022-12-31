/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { PageSize, PdfJs } from '@react-pdf-viewer/core';
import { getPage, useIsMounted } from '@react-pdf-viewer/core';
import * as React from 'react';
import { PageThumbnail } from './PageThumbnail';

export const PageThumbnailContainer: React.FC<{
    canvas: HTMLCanvasElement;
    doc: PdfJs.PdfDocument;
    pageIndex: number;
    pageRotation: number;
    pageSize: PageSize;
    rotation: number;
    shouldRender: boolean;
    onLoad(): void;
}> = ({ canvas, doc, pageIndex, pageRotation, pageSize, rotation, shouldRender, onLoad }) => {
    const isMounted = useIsMounted();
    const [page, setPage] = React.useState<PdfJs.Page>(null);
    const isVertical = Math.abs(rotation + pageRotation) % 180 === 0;

    React.useEffect(() => {
        if (shouldRender) {
            getPage(doc, pageIndex).then((pdfPage) => {
                isMounted.current && setPage(pdfPage);
            });
        }
    }, [shouldRender]);

    // To support the document which is already rotated
    const rotationNumber = (pageSize.rotation + rotation + pageRotation) % 360;

    return (
        page && (
            <PageThumbnail
                canvas={canvas}
                page={page}
                pageHeight={isVertical ? pageSize.pageHeight : pageSize.pageWidth}
                pageIndex={pageIndex}
                pageWidth={isVertical ? pageSize.pageWidth : pageSize.pageHeight}
                rotation={rotationNumber}
                onLoad={onLoad}
            />
        )
    );
};
