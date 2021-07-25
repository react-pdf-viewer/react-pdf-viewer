/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import { Annotation } from './Annotation';
import { AnnotationType } from './AnnotationType';
import { Popup } from './Popup';
import type { PdfJs } from '../types/PdfJs';

export const Highlight: React.FC<{
    annotation: PdfJs.Annotation;
    childAnnotation?: PdfJs.Annotation;
    page: PdfJs.Page;
    viewport: PdfJs.ViewPort;
}> = ({ annotation, childAnnotation, page, viewport }) => {
    const hasPopup = annotation.hasPopup === false;
    const isRenderable = !!(annotation.hasPopup || annotation.title || annotation.contents);

    // Check if the highlight area is constructed by multiple quadrilaterals
    const hasQuadPoints = annotation.quadPoints && annotation.quadPoints.length > 0;

    if (hasQuadPoints) {
        const annotations = annotation.quadPoints.map(
            (quadPoint) =>
                Object.assign({}, annotation, {
                    rect: [quadPoint[2].x, quadPoint[2].y, quadPoint[1].x, quadPoint[1].y],
                    // Reset the `quadPoints` property to avoid the infinitive loop
                    quadPoints: [],
                }) as PdfJs.Annotation
        );
        return (
            <>
                {annotations.map((ann, index) => (
                    <Highlight
                        key={index}
                        annotation={ann}
                        childAnnotation={childAnnotation}
                        page={page}
                        viewport={viewport}
                    />
                ))}
            </>
        );
    }

    return (
        <Annotation
            annotation={annotation}
            hasPopup={hasPopup}
            ignoreBorder={true}
            isRenderable={isRenderable}
            page={page}
            viewport={viewport}
        >
            {(props): React.ReactElement => (
                <>
                    <div
                        {...props.slot.attrs}
                        className="rpv-core__annotation rpv-core__annotation--highlight"
                        data-annotation-id={annotation.id}
                        onClick={props.popup.toggleOnClick}
                        onMouseEnter={props.popup.openOnHover}
                        onMouseLeave={props.popup.closeOnHover}
                    >
                        {props.slot.children}
                    </div>
                    {childAnnotation &&
                        childAnnotation.annotationType === AnnotationType.Popup &&
                        props.popup.opened && <Popup annotation={childAnnotation} page={page} viewport={viewport} />}
                </>
            )}
        </Annotation>
    );
};
