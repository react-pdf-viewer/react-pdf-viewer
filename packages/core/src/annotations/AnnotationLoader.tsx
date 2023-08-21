/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { useIsMounted } from '../hooks/useIsMounted';
import { type PdfJs } from '../types/PdfJs';

interface Status {
    loading: boolean;
    annotations: PdfJs.Annotation[];
}

export const AnnotationLoader: React.FC<{
    page: PdfJs.Page;
    renderAnnotations(annotations: PdfJs.Annotation[]): React.ReactElement;
}> = ({ page, renderAnnotations }) => {
    const isMounted = useIsMounted();
    const [status, setStatus] = React.useState<Status>({
        loading: true,
        annotations: [],
    });

    React.useEffect(() => {
        page.getAnnotations({ intent: 'display' }).then((result) => {
            if (isMounted.current) {
                setStatus({
                    loading: false,
                    annotations: result,
                });
            }
        });
    }, []);

    return status.loading ? <></> : renderAnnotations(status.annotations);
};
