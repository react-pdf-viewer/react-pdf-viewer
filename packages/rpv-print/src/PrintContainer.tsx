/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useEffect, useState } from 'react';
import { PdfJs, Store, StoreHandler } from '@phuocng/rpv';

import PrintProgress from './PrintProgress';
import PrintStatus from './PrintStatus';
import PrintZone from './PrintZone';
import './printZone.less';
import StoreProps from './StoreProps';

interface PrintContainerProps {
    doc: PdfJs.PdfDocument;
    pageHeight: number;
    pageWidth: number;
    rotation: number;
    store: Store<StoreProps>;
}

const PrintContainer: React.FC<PrintContainerProps> = ({ doc, pageHeight, pageWidth, rotation, store }) => {
    const [printStatus, setPrintStatus] = useState(PrintStatus.Inactive);
    const [numLoadedPagesForPrint, setNumLoadedPagesForPrint] = useState(0);

    const cancelPrinting = (): void => {
        setNumLoadedPagesForPrint(0);
        setPrintStatus(PrintStatus.Inactive);
    };

    const startPrinting = (): void => {
        setNumLoadedPagesForPrint(0);
        setPrintStatus(PrintStatus.Ready);
    };

    const handlePrintStatus: StoreHandler<PrintStatus> = (status: PrintStatus) => setPrintStatus(status);

    useEffect(() => {
        store.subscribe('printStatus', handlePrintStatus);
        return () => {
            store.unsubscribe('printStatus', handlePrintStatus);
        };
    }, []);

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
