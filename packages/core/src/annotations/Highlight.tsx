/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import ThemeContext from '../theme/ThemeContext';
import PdfJs from '../vendors/PdfJs';
import Annotation from './Annotation';

interface HighlightProps {
    annotation: PdfJs.Annotation;
    page: PdfJs.Page;
    viewport: PdfJs.ViewPort;
}

const Highlight: React.FC<HighlightProps> = ({ annotation, page, viewport }) => {
    const theme = React.useContext(ThemeContext);
    const hasPopup = annotation.hasPopup === false;
    const isRenderable = !!(annotation.hasPopup || annotation.title || annotation.contents);

    // Check if the highlight area is constructed by multiple quadrilaterals
    const hasQuadPoints = annotation.quadPoints && annotation.quadPoints.length > 0;

    if (hasQuadPoints) {
        const annotations = annotation.quadPoints.map(quadPoint => (
            Object.assign({}, annotation, {
                rect: [
                    quadPoint[2].x,
                    quadPoint[2].y,
                    quadPoint[1].x,
                    quadPoint[1].y,
                ],
                // Reset the `quadPoints` property to avoid the infinitive loop
                quadPoints: [],
            }) as PdfJs.Annotation
        ));
        return (
            <>
            {
                annotations.map((ann, index) => (
                    <Highlight
                        key={index}
                        annotation={ann}
                        page={page}
                        viewport={viewport}
                    />
                ))
            }
            </>
        );
    }

    return (
        <Annotation annotation={annotation} hasPopup={hasPopup} ignoreBorder={true} isRenderable={isRenderable} page={page} viewport={viewport}>
            {(props): React.ReactElement => (
                <div
                    {...props.slot.attrs}
                    className={`${theme.prefixClass}-annotation ${theme.prefixClass}-annotation-highlight`}
                    data-annotation-id={annotation.id}
                    onClick={props.popup.toggleOnClick}
                    onMouseEnter={props.popup.openOnHover}
                    onMouseLeave={props.popup.closeOnHover}
                >
                    {props.slot.children}
                </div>
            )}
        </Annotation>
    );
};

export default Highlight;
