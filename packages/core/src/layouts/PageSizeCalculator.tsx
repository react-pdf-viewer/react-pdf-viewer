/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Spinner } from '../components/Spinner';
import { ScrollMode } from '../structs/ScrollMode';
import { ViewMode } from '../structs/ViewMode';
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
    render(pageSizes: PageSize[], initialScale: number): React.ReactElement;
    scrollMode: ScrollMode;
    viewMode: ViewMode;
}> = ({ defaultScale, doc, render, scrollMode, viewMode }) => {
    const pagesRef = React.useRef<HTMLDivElement>();
    const [state, setState] = React.useState<{
        pageSizes: PageSize[];
        scale: number;
    }>({
        pageSizes: [],
        scale: 0,
    });

    React.useLayoutEffect(() => {
        const queryPageSizes = Array(doc.numPages)
            .fill(0)
            .map(
                (_, i) =>
                    new Promise<PageSize>((resolve, _) => {
                        getPage(doc, i).then((pdfPage) => {
                            const viewport = pdfPage.getViewport({ scale: 1 });
                            resolve({
                                pageHeight: viewport.height,
                                pageWidth: viewport.width,
                                rotation: viewport.rotation,
                            });
                        });
                    })
            );
        Promise.all(queryPageSizes).then((pageSizes) => {
            // Determine the initial scale
            const pagesEle = pagesRef.current;
            if (!pagesEle || pageSizes.length === 0) {
                return;
            }

            // Get the dimension of the first page
            const w = pageSizes[0].pageWidth;
            const h = pageSizes[0].pageHeight;

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
                    ? calculateScale(parentEle, h, w, defaultScale, viewMode, doc.numPages)
                    : defaultScale
                : decrease(scaled);

            setState({ pageSizes, scale });
        });
    }, [doc.loadingTask.docId]);

    return state.pageSizes.length === 0 || state.scale === 0 ? (
        <div className="rpv-core__page-size-calculator" data-testid="core__page-size-calculating" ref={pagesRef}>
            <Spinner />
        </div>
    ) : (
        render(state.pageSizes, state.scale)
    );
};
