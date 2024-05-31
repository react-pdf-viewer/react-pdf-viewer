/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';
import { useSafeState } from '../hooks/useSafeState';
import { type PdfJs } from '../types/PdfJs';

interface Status {
    loading: boolean;
    annotations: PdfJs.Annotation[];
}

export const AnnotationLoader: React.FC<{
    page: PdfJs.Page;
    renderAnnotations(annotations: PdfJs.Annotation[]): React.ReactElement;
}> = ({ page, renderAnnotations }) => {
    const [status, setStatus] = useSafeState<Status>({
        loading: true,
        annotations: [],
    });

    React.useEffect(() => {
        page.getAnnotations({ intent: 'display' }).then((result) => {
            setStatus({
                loading: false,
                annotations: result,
            });
        });
    }, []);

    return status.loading ? <></> : renderAnnotations(status.annotations);
};
