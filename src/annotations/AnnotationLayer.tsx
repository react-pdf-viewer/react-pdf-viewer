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
import Popup from './Popup';
import Text from './Text';

interface AnnotationLayerProps {
    doc: PdfJs.PdfDocument;
    page: PdfJs.Page;
    rotation: number;
    scale: number;
    onJumpToDest(pageIndex: number, bottomOffset: number, scaleTo: number | SpecialZoomLevel): void;
}

const AnnotationLayer: React.FC<AnnotationLayerProps> = ({ doc, page, rotation, scale, onJumpToDest }) => {
    const theme = React.useContext(ThemeContent);

    const renderAnnotations = (annotations: PdfJs.Annotation[]): React.ReactElement => {
        const viewport = page.getViewport({ rotation, scale });
        const clonedViewPort = viewport.clone({ dontFlip: true });

        return (
            <>
            {
                annotations.map((annotation) => {
                    console.log(annotation);
                    switch (annotation.annotationType) {
                        case AnnotationType.Link:
                            return (
                                <Link
                                    key={annotation.id}
                                    annotation={annotation}
                                    doc={doc}
                                    page={page}
                                    viewport={clonedViewPort}
                                    onJumpToDest={onJumpToDest}
                                />
                            );
                        case AnnotationType.Popup:
                            return (
                                <Popup
                                    key={annotation.id}
                                    annotation={annotation}
                                    page={page}
                                    viewport={clonedViewPort}
                                />
                            );
                        case AnnotationType.Text:
                            return (
                                <Text
                                    key={annotation.id}
                                    annotation={annotation}
                                    doc={doc}
                                    page={page}
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
