/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { useIsMounted, type PdfJs } from '@react-pdf-viewer/core';
import * as React from 'react';

export const FetchLabels: React.FC<{
    children: (labels: string[]) => React.ReactElement;
    doc: PdfJs.PdfDocument;
}> = ({ children, doc }) => {
    const isMounted = useIsMounted();
    const [status, setStatus] = React.useState<{
        loading: boolean;
        labels: string[];
    }>({
        loading: true,
        labels: [],
    });

    React.useEffect(() => {
        doc.getPageLabels().then((result) => {
            isMounted.current && setStatus({ loading: false, labels: result || [] });
        });
    }, [doc.loadingTask.docId]);

    return status.loading ? <></> : children(status.labels);
};
