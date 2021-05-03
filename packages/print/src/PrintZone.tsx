/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { createPortal } from 'react-dom';
import { PdfJs } from '@react-pdf-viewer/core';

import PageThumbnailContainer from './PageThumbnailContainer';
import PrintStatus from './PrintStatus';

interface PrintZoneProps {
    doc: PdfJs.PdfDocument;
    numLoadedPages: number;
    pageHeight: number;
    pageWidth: number;
    printStatus: PrintStatus;
    rotation: number;
    onCancel(): void;
    onLoad(): void;
}

const PrintZone: React.FC<PrintZoneProps> = ({ doc, numLoadedPages, pageHeight, pageWidth, printStatus, rotation, onCancel, onLoad }) => {
    React.useEffect(() => {
        if (printStatus === PrintStatus.Ready) {
            document.body.classList.add('rpv-body-printing');
            window.print();
        }

        // Handle the case user clicks the `Cancel` button in the print window
        const handler = (): void => {
            if (printStatus === PrintStatus.Ready) {
                document.body.classList.remove('rpv-body-printing');
                onCancel();
            }
        };
        document.addEventListener('mousemove', handler);

        return (): void => document.removeEventListener('mousemove', handler);
    }, [printStatus]);

    return (
        createPortal(
            (
                <>
                <div className='rpv-print-zone'>
                    {
                        Array(Math.min(numLoadedPages + 1, doc.numPages)).fill(0).map((_, index) => (
                            <PageThumbnailContainer
                                key={index}
                                doc={doc}
                                pageHeight={pageHeight}
                                pageIndex={index}
                                pageWidth={pageWidth}
                                rotation={rotation}
                                onLoad={onLoad}
                            />
                        ))
                    }
                </div>
                <style
                    dangerouslySetInnerHTML={{
                        __html: `@page { size: ${pageWidth}pt ${pageHeight}pt }`
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
