/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useContext } from 'react';

import ThemeContent from '../theme/ThemeContext';
import PdfJs from '../vendors/PdfJs';
import Annotation from './Annotation';

interface UnderlineProps {
    annotation: PdfJs.Annotation;
    page: PdfJs.Page;
    viewport: PdfJs.ViewPort;
}

const Underline: React.FC<UnderlineProps> = ({ annotation, page, viewport }) => {
    const theme = useContext(ThemeContent);
    const hasPopup = annotation.hasPopup === false;
    const isRenderable = !!(annotation.hasPopup || annotation.title || annotation.contents);

    return (
        <Annotation annotation={annotation} hasPopup={hasPopup} ignoreBorder={true} isRenderable={isRenderable} page={page} viewport={viewport}>
            {(props): React.ReactElement => (
                <div
                    {...props.slot.attrs}
                    className={`${theme.prefixClass}-annotation ${theme.prefixClass}-annotation-underline`}
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

export default Underline;
