/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import PdfJs from '../vendors/PdfJs';
import PrintProgress from './PrintProgress';
import PrintStatus from './PrintStatus';
import PrintZone from './PrintZone';
import './printZone.less';

interface PrintContainerProps {
    doc: PdfJs.PdfDocument;
    pageHeight: number;
    pageWidth: number;
    printStatus: PrintStatus;
    rotation: number;
    onCancel(): void;
    onStartPrinting(): void;
}

const PrintContainer: React.FC<PrintContainerProps> = ({ doc, pageHeight, pageWidth, printStatus, rotation, onCancel, onStartPrinting }) => {
    const [numLoadedPagesForPrint, setNumLoadedPagesForPrint] = React.useState(0);

    const cancelPrinting = (): void => {
        setNumLoadedPagesForPrint(0);
        onCancel();
    };

    const startPrinting = (): void => {
        setNumLoadedPagesForPrint(0);
        onStartPrinting();
    }; 

    return (
        <>
        {printStatus === PrintStatus.Preparing && (
            <PrintProgress
                numLoadedPages={numLoadedPagesForPrint}
                numPages={doc.numPages}
                onCancel={cancelPrinting}
                onStartPrinting={startPrinting}
            />
        )}
        {(printStatus === PrintStatus.Preparing || printStatus === PrintStatus.Ready) && (
            <PrintZone
                doc={doc}
                pageHeight={pageHeight}
                pageWidth={pageWidth}
                printStatus={printStatus}
                rotation={rotation}
                onCancel={cancelPrinting}
                onLoad={setNumLoadedPagesForPrint}
            />
        )}
        </>
    );
};

export default PrintContainer;
