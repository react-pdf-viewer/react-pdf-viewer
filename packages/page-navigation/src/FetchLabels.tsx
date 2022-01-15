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
    const [labels, setLabels] = React.useState<string[]>([]);

    React.useEffect(() => {
        doc.getPageLabels().then((result) => {
            isMounted.current && setLabels(result || []);
        });
    }, [doc.loadingTask.docId]);

    return children(labels);
};
