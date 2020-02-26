/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';
import ReactDOM from 'react-dom';

import './printZone.css';
import PdfJs from '../PdfJs';
import PageThumbnailContainer from './PageThumbnailContainer';
import PrintStatus from './PrintStatus';

interface PrintZoneProps {
    doc: PdfJs.PdfDocument;
    pageHeight: number;
    pageWidth: number;
    printStatus: PrintStatus;
    rotation: number;
    onLoad(numberOfPages: number): void;
}

const PrintZone: React.FC<PrintZoneProps> = ({ doc, pageHeight, pageWidth, printStatus, rotation, onLoad }) => {
    const [numLoadedPages, setNumLoadedPages] = React.useState(0);
    React.useEffect(() => {
        printStatus === PrintStatus.Ready && window.print();
    }, [printStatus]);

    const { numPages } = doc;
    const loadPage = () => {
        const total = numLoadedPages + 1;
        setNumLoadedPages(total);
        onLoad(total);
    };

    return (
        ReactDOM.createPortal(
            <div className='viewer-print-container'>
                {
                    Array(numPages).fill(0).map((_, index) => {
                        return (
                            <div
                                className='viewer-print-page'
                                key={index}
                            >
                                <PageThumbnailContainer
                                    doc={doc}
                                    pageHeight={pageHeight}
                                    pageIndex={index}
                                    pageWidth={pageWidth}
                                    rotation={rotation}
                                    onLoad={loadPage}
                                />
                            </div>
                        );
                    })
                }
            </div>,
            document.body
        )
    );
};

export default PrintZone;
