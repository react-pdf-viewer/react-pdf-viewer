/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Spinner } from '@react-pdf-viewer/core';
import type { PdfJs } from '@react-pdf-viewer/core';

export const LabelsLoader: React.FC<{
    children(labels: string[]): React.ReactElement;
    doc: PdfJs.PdfDocument;
}> = ({ children, doc }) => {
    const [labels, setLabels] = React.useState<string[]>();

    React.useEffect(() => {
        doc.getPageLabels().then((labels) => {
            setLabels(labels || []);
        });
    }, [doc]);

    return labels ? (
        children(labels)
    ) : (
        <div className="rpv-thumbnail__loader">
            <Spinner />
        </div>
    );
};
