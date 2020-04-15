/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import ThemeContent from '../theme/ThemeContext';
import PdfJs from '../vendors/PdfJs';
import AnnotationLoader from './AnnotationLoader';
import AnnotationType from './AnnotationType';
import Link from './Link';

interface AnnotationLayerProps {
    doc: PdfJs.PdfDocument;
    page: PdfJs.Page;
    rotation: number;
    scale: number;
}

const AnnotationLayer: React.FC<AnnotationLayerProps> = ({ doc, page, rotation, scale }) => {
    const theme = React.useContext(ThemeContent);

    const renderAnnotations = (annotations: PdfJs.Annotation[]) => {
        console.log(annotations);
        const viewport = page.getViewport({ rotation, scale });
        const clonedViewPort = viewport.clone({ dontFlip: true });

        return (
            <>
            {
                annotations.map((annotation) => {
                    switch (annotation.annotationType) {
                        case AnnotationType.Link:
                            return (
                                <Link
                                    key={annotation.id}
                                    page={page}
                                    rect={annotation.rect}
                                    viewport={clonedViewPort}
                                />
                            );
                        default:
                            return <></>;
                    }
                })
            }
            </>
        );
    };

    return (
        <div className={`${theme.prefixClass}-annotation-layer`}>
            <AnnotationLoader page={page} renderAnnotations={renderAnnotations} />
        </div>
    );
};

export default AnnotationLayer;
