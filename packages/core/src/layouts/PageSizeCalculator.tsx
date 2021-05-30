/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import Spinner from '../components/Spinner';
import SpecialZoomLevel from '../SpecialZoomLevel';
import PdfJs from '../vendors/PdfJs';
import { decrease } from '../zoom/zoomingLevel';
import calculateScale from './calculateScale';
import PageSize from './PageSize';

interface PageSizeCalculatorProps {
    defaultScale?: number | SpecialZoomLevel;
    doc: PdfJs.PdfDocument;
    render(pageSize: PageSize): React.ReactElement;
}

const PageSizeCalculator: React.FC<PageSizeCalculatorProps> = ({ defaultScale, doc, render }) => {
    const pagesRef = React.useRef<HTMLDivElement | null>(null);
    const [pageSize, setPageSize] = React.useState<PageSize>({
        pageHeight: 0,
        pageWidth: 0,
        scale: 1,
    });

    React.useEffect(() => {
        doc.getPage(1).then((pdfPage) => {
            const viewport = pdfPage.getViewport({ scale: 1 });
            const w = viewport.width;
            const h = viewport.height;

            const pagesEle = pagesRef.current;
            if (!pagesEle) {
                return;
            }            

            // Determine the best scale that fits the document within the container
            // We spend 50 pixels in the left and right sides for other parts such as sidebar
            const scaled = (pagesEle.clientWidth - 2 * 50) / w;
            
            let scale = defaultScale
                        ? (typeof defaultScale === 'string' ? calculateScale(pagesEle, h, w, defaultScale) : defaultScale)
                        : decrease(scaled);

            setPageSize({
                pageHeight: h,
                pageWidth: w,
                scale,
            });
        });
    }, [doc]);

    const { pageWidth } = pageSize;
    return (
        pageWidth === 0
            ? (
                <div className='rpv-core__page-size-calculator' ref={pagesRef}>
                    <Spinner />
                </div>
            )
            : render(pageSize)
    );
};

export default PageSizeCalculator;
