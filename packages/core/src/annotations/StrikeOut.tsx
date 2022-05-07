/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import type { PdfJs } from '../types/PdfJs';
import { Annotation } from './Annotation';

export const StrikeOut: React.FC<{
    annotation: PdfJs.Annotation;
    page: PdfJs.Page;
    viewport: PdfJs.ViewPort;
}> = ({ annotation, page, viewport }) => {
    const hasPopup = annotation.hasPopup === false;
    const isRenderable = !!(annotation.hasPopup || annotation.title || annotation.contents);

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
                <div
                    {...props.slot.attrs}
                    className="rpv-core__annotation rpv-core__annotation--strike-out"
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
