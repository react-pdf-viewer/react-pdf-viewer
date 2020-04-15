/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import ThemeContent from '../theme/ThemeContext';
import SpecialZoomLevel from '../SpecialZoomLevel';
import PdfJs from '../vendors/PdfJs';
import AnnotationLoader from './AnnotationLoader';
import AnnotationType from './AnnotationType';
import Link from './Link';

interface AnnotationLayerProps {
    doc: PdfJs.PdfDocument;
    page: PdfJs.Page;
    rotation: number;
    scale: number;
    onJumpToDest(pageIndex: number, bottomOffset: number, scaleTo: number | SpecialZoomLevel): void;
}

const AnnotationLayer: React.FC<AnnotationLayerProps> = ({ doc, page, rotation, scale, onJumpToDest }) => {
    const theme = React.useContext(ThemeContent);

    const renderAnnotations = (annotations: PdfJs.Annotation[]) => {
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
                                    dest={annotation.dest}
                                    doc={doc}
                                    page={page}
                                    rect={annotation.rect}
                                    viewport={clonedViewPort}
                                    onJumpToDest={onJumpToDest}
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
