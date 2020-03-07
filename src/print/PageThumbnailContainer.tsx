/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import PdfJs from '../PdfJs';
import Spinner from '../components/Spinner';
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
    width: number;
}

const PageThumbnailContainer: React.FC<PageThumbnailContainerProps> = ({ doc, pageHeight, pageIndex, pageWidth, rotation, onLoad }) => {
    const [pageSize, setPageSize] = React.useState<PageState>({
        height: pageHeight,
        page: null,
        width: pageWidth,
    });
    const { page, height, width } = pageSize;
    const isVertical = Math.abs(rotation) % 180 === 0;

    React.useEffect(() => {
        doc.getPage(pageIndex + 1).then((pdfPage) => {
            const viewport = pdfPage.getViewport({ scale: 1 });

            setPageSize({
                height: viewport.height,
                page: pdfPage,
                width: viewport.width,
            });
        });
    }, []);

    return (
        !page
            ? <Spinner />
            : (
                <PageThumbnail
                    page={page}
                    pageHeight={isVertical ? height : width}
                    pageWidth={isVertical ? width : height}
                    rotation={rotation}
                    onLoad={onLoad}
                />
            )
    );
};

export default PageThumbnailContainer;
