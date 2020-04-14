/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import PdfJs from '../vendors/PdfJs';
import AnnotationLoader from './AnnotationLoader';

interface AnnotationLayerProps {
    doc: PdfJs.PdfDocument;
    page: PdfJs.Page;
}

const AnnotationLayer: React.FC<AnnotationLayerProps> = ({ doc, page }) => {
    const renderAnnotations = (annotations: PdfJs.Annotation[]) => {
        console.log(annotations);
        return (<></>);
    };

    return (
        <AnnotationLoader page={page} renderAnnotations={renderAnnotations} />
    );
};

export default AnnotationLayer;
