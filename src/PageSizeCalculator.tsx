/**
 * A React component to view a PDF document
 * 
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import PdfJs from './PdfJs';
import Spinner from './Spinner';

interface PageSize {
    pageHeight: number;
    pageWidth: number;
    scale: number;
}

interface PageSizeCalculatorProps {
    doc: PdfJs.PdfDocument;
    render(pageSize: PageSize): React.ReactElement;
}

const PageSizeCalculator: React.FC<PageSizeCalculatorProps> = ({ doc, render }) => {
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
            const scale = Math.min(1, pagesEle.offsetWidth / w);
            setPageSize({
                pageHeight: h,
                pageWidth: w,
                scale,
            });
        });
    }, [doc]);

    const { pageWidth } = pageSize;
    return (
        <div ref={pagesRef}>
            {
                pageWidth === 0
                    ? (
                        <div
                            style={{
                                alignItems: 'center',
                                display: 'flex',
                                height: '100%',
                                justifyContent: 'center',
                                width: '100%',
                            }}
                        >
                            <Spinner />
                        </div>
                    )
                    : render(pageSize)
            }
        </div>
    );
};

export {
    PageSize,
};

export default PageSizeCalculator;
