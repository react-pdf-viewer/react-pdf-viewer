/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import type { PdfJs, Store, StoreHandler } from '@react-pdf-viewer/core';

import { CheckPrintPermission } from './CheckPrintPermission';
import { PrintProgress } from './PrintProgress';
import { PrintStatus } from './structs/PrintStatus';
import { PrintZone } from './PrintZone';
import type { StoreProps } from './types/StoreProps';

export const PrintContainer: React.FC<{
    doc: PdfJs.PdfDocument;
    pageHeight: number;
    pageWidth: number;
    rotation: number;
    store: Store<StoreProps>;
}> = ({ doc, pageHeight, pageWidth, rotation, store }) => {
    const [printStatus, setPrintStatus] = React.useState(PrintStatus.Inactive);
    const [numLoadedPagesForPrint, setNumLoadedPagesForPrint] = React.useState(0);

    const cancelPrinting = (): void => {
        setNumLoadedPagesForPrint(0);
        setPrintStatus(PrintStatus.Inactive);
    };

    const handlePrintStatus: StoreHandler<PrintStatus> = (status: PrintStatus) => setPrintStatus(status);

    const onLoadPage = () => {
        const total = numLoadedPagesForPrint + 1;
        if (total <= doc.numPages) {
            setNumLoadedPagesForPrint(total);
            total === doc.numPages && setPrintStatus(PrintStatus.Ready);
        }
    };

    React.useEffect(() => {
        store.subscribe('printStatus', handlePrintStatus);
        return () => {
            store.unsubscribe('printStatus', handlePrintStatus);
        };
    }, []);

    return (
        <>
            {printStatus === PrintStatus.CheckingPermission && <CheckPrintPermission doc={doc} store={store} />}
            {printStatus === PrintStatus.Preparing && (
                <PrintProgress
                    numLoadedPages={numLoadedPagesForPrint}
                    numPages={doc.numPages}
                    onCancel={cancelPrinting}
                />
            )}
            {(printStatus === PrintStatus.Preparing || printStatus === PrintStatus.Ready) &&
                numLoadedPagesForPrint <= doc.numPages && (
                    <PrintZone
                        doc={doc}
                        numLoadedPages={numLoadedPagesForPrint}
                        pageHeight={pageHeight}
                        pageWidth={pageWidth}
                        printStatus={printStatus}
                        rotation={rotation}
                        onCancel={cancelPrinting}
                        onLoad={onLoadPage}
                    />
                )}
        </>
    );
};
