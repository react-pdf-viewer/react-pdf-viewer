/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import PdfJs from '../vendors/PdfJs';
import ThemeContext from '../theme/ThemeContext';
import PageThumbnailContainer from './PageThumbnailContainer';
import PrintStatus from './PrintStatus';
import './printZone.less';

interface PrintZoneProps {
    doc: PdfJs.PdfDocument;
    pageHeight: number;
    pageWidth: number;
    printStatus: PrintStatus;
    rotation: number;
    onCancel(): void;
    onLoad(numberOfPages: number): void;
}

const PrintZone: React.FC<PrintZoneProps> = ({ doc, pageHeight, pageWidth, printStatus, rotation, onCancel, onLoad }) => {
    const theme = useContext(ThemeContext);
    const [numLoadedPages, setNumLoadedPages] = useState(0);

    useEffect(() => {
        if (printStatus === PrintStatus.Ready) {
            document.body.classList.add(`${theme.prefixClass}-body-printing`);
            window.print();
        }

        // Handle the case user clicks the `Cancel` button in the print window
        const handler = (): void => {
            if (printStatus === PrintStatus.Ready) {
                document.body.classList.remove(`${theme.prefixClass}-body-printing`);
                onCancel();
            }
        };
        document.addEventListener('mousemove', handler);

        return (): void => document.removeEventListener('mousemove', handler);
    }, [printStatus]);

    const { numPages } = doc;
    const loadPage = (): void => {
        const total = numLoadedPages + 1;
        setNumLoadedPages(total);
        onLoad(total);
    };

    return (
        createPortal(
            (
                <>
                <div className={`${theme.prefixClass}-print-zone`}>
                    {
                        Array(numPages).fill(0).map((_, index) => {
                            return (
                                <PageThumbnailContainer
                                    key={index}
                                    doc={doc}
                                    pageHeight={pageHeight}
                                    pageIndex={index}
                                    pageWidth={pageWidth}
                                    rotation={rotation}
                                    onLoad={loadPage}
                                />
                            );
                        })
                    }
                </div>
                <style
                    dangerouslySetInnerHTML={{
                        __html: `
                            @supports ((size:A4) and (size:1pt 1pt)) {
                                @page { size: ${pageWidth}pt ${pageHeight}pt }
                            }
                        `
                    }}
                >
                </style>
                </>
            ),
            document.body
        )
    );
};

export default PrintZone;
