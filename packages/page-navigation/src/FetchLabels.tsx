/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import { useSafeState, type PdfJs } from '@react-pdf-viewer/core';
import * as React from 'react';

export const FetchLabels: React.FC<{
    children: (labels: string[]) => React.ReactElement;
    doc: PdfJs.PdfDocument;
}> = ({ children, doc }) => {
    const [status, setStatus] = useSafeState<{
        loading: boolean;
        labels: string[];
    }>({
        loading: true,
        labels: [],
    });

    React.useEffect(() => {
        doc.getPageLabels().then((result) => {
            setStatus({ loading: false, labels: result || [] });
        });
    }, [doc.loadingTask.docId]);

    return status.loading ? <></> : children(status.labels);
};
