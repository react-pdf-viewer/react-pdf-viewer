/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Spinner } from '../components/Spinner';
import { ScrollMode } from '../structs/ScrollMode';
import { SpecialZoomLevel } from '../structs/SpecialZoomLevel';
import type { PageSize } from '../types/PageSize';
import type { PdfJs } from '../types/PdfJs';
import { getPage } from '../utils/managePages';
import { decrease } from '../zoom/zoomingLevel';
import { calculateScale } from './calculateScale';

// The height that can be reserved for additional elements such as toolbar
const RESERVE_HEIGHT = 45;

// The width that can be reserved for additional elements such as sidebar
const RESERVE_WIDTH = 45;

export const PageSizeCalculator: React.FC<{
    defaultScale?: number | SpecialZoomLevel;
    doc: PdfJs.PdfDocument;
    render(pageSize: PageSize): React.ReactElement;
    scrollMode: ScrollMode;
}> = ({ defaultScale, doc, render, scrollMode }) => {
    const pagesRef = React.useRef<HTMLDivElement>();
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
            const scaleWidth = (parentEle.clientWidth - RESERVE_WIDTH) / w;
            const scaleHeight = (parentEle.clientHeight - RESERVE_HEIGHT) / h;

            let scaled = scaleWidth;
            switch (scrollMode) {
                case ScrollMode.Horizontal:
                    scaled = Math.min(scaleWidth, scaleHeight);
                    break;
                case ScrollMode.Vertical:
                default:
                    scaled = scaleWidth;
                    break;
            }

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
        <div className="rpv-core__page-size-calculator" data-testid="core__page-size-calculating" ref={pagesRef}>
            <Spinner />
        </div>
    ) : (
        render(pageSize)
    );
};
