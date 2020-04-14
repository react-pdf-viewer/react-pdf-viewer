/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import Spinner from '../components/Spinner';
import PdfJs from '../vendors/PdfJs';

interface AnnotationLayerProps {
    page: PdfJs.Page;
    renderAnnotations(annotations: PdfJs.Annotation[]): React.ReactElement;
}

const AnnotationLoader: React.FC<AnnotationLayerProps> = ({ page, renderAnnotations }) => {
    const [loading, setLoading] = React.useState(false);
    const [annotations, setAnnotations] = React.useState<PdfJs.Annotation[]>([]);

    React.useEffect(() => {
        page.getAnnotations({ intent: 'display' }).then((result) => {
            setAnnotations(result);
        });
    }, []);

    return (
        loading
            ? <Spinner />
            : renderAnnotations(annotations)
    );
};

export default AnnotationLoader;
