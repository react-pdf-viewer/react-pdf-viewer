/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { useIsMounted } from '@react-pdf-viewer/core';
import type { PdfJs } from '@react-pdf-viewer/core';

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
