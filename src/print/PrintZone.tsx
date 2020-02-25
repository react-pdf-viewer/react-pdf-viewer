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

interface PrintZoneProps {
    doc: PdfJs.PdfDocument;
    pageHeight: number;
    pageWidth: number;
    rotation: number;
}

const PrintZone: React.FC<PrintZoneProps> = ({ doc, pageHeight, rotation, pageWidth }) => {
    const [numLoadedPages, setNumLoadedPages] = React.useState(0);
    const { numPages } = doc;

    const loadPage = () => {
        const total = numLoadedPages + 1
        setNumLoadedPages(total);
        if (total === numPages) {
            // window.print();
        }
    };

    return (
        ReactDOM.createPortal(
            <div
                className='viewer-print-container'
                // Take the full size
                style={{
                    // display: 'none',
                    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    // left: 0,
                    // overflow: 'auto',
                    // top: 0,
                    // width: '100%',
                    // zIndex: 9999,
                }}
            >
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
