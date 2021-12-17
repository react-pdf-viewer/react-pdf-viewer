/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import { Spinner } from '../components/Spinner';
import { SpecialZoomLevel } from '../structs/SpecialZoomLevel';
import { getPage } from '../utils/managePages';
import { decrease } from '../zoom/zoomingLevel';
import { calculateScale } from './calculateScale';
import type { PageSize } from '../types/PageSize';
import type { PdfJs } from '../types/PdfJs';

// The width that can be reserved for additional elements such as sidebar
const RESERVE_WIDTH = 45;

export const PageSizeCalculator: React.FC<{
    defaultScale?: number | SpecialZoomLevel;
    doc: PdfJs.PdfDocument;
    render(pageSize: PageSize): React.ReactElement;
}> = ({ defaultScale, doc, render }) => {
    const pagesRef = React.useRef<HTMLDivElement | null>(null);
    const [pageSize, setPageSize] = React.useState<PageSize>({
        pageHeight: 0,
        pageWidth: 0,
        scale: 1,
    });

    React.useLayoutEffect(() => {
        getPage(doc, 0).then((pdfPage) => {
            const viewport = pdfPage.getViewport({ scale: 1 });
            const w = viewport.width;
            const h = viewport.height;

            const pagesEle = pagesRef.current;
            if (!pagesEle) {
                return;
            }
            // The `pagesRef` element will be destroyed when the size calculation is completed
            // To make it more easy for testing, we take the parent element which is always visible
            const parentEle = pagesEle.parentElement;

            // Determine the best scale that fits the document within the container
            const scaled = (parentEle.clientWidth - RESERVE_WIDTH) / w;

            let scale = defaultScale
                ? typeof defaultScale === 'string'
                    ? calculateScale(parentEle, h, w, defaultScale)
                    : defaultScale
                : decrease(scaled);

            setPageSize({
                pageHeight: h,
                pageWidth: w,
                scale,
            });
        });
    }, [doc]);

    const { pageWidth } = pageSize;
    return pageWidth === 0 ? (
        <div className="rpv-core__page-size-calculator" ref={pagesRef}>
            <Spinner />
        </div>
    ) : (
        render(pageSize)
    );
};
