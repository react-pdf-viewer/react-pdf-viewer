/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import PdfJs from '../vendors/PdfJs';

interface AnnotationLayerProps {
    page: PdfJs.Page;
    renderAnnotations(annotations: PdfJs.Annotation[]): React.ReactElement;
}

const AnnotationLoader: React.FC<AnnotationLayerProps> = ({ page, renderAnnotations }) => {
    const [loading, setLoading] = React.useState(true);
    const [annotations, setAnnotations] = React.useState<PdfJs.Annotation[]>([]);

    React.useEffect(() => {
        page.getAnnotations({ intent: 'display' }).then((result) => {
            setLoading(false);
            setAnnotations(result);
        });
    }, []);

    return (
        loading
            ? <></>
            : renderAnnotations(annotations)
    );
};

export default AnnotationLoader;
