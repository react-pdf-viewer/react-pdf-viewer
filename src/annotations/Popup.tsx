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
import PopupWrapper from './PopupWrapper';

interface PopupProps {
    annotation: PdfJs.Annotation;
    page: PdfJs.Page;
    viewport: PdfJs.ViewPort;
}

const Popup: React.FC<PopupProps> = ({ annotation, page, viewport }) => {
    const theme = useContext(ThemeContent);
    const isRenderable = !!(annotation.title || annotation.contents);

    // Don't render the popup for annotation whose parent renders the annotation themselves
    const ignoredParents = ['Circle', 'Ink', 'Line', 'Polygon', 'PolyLine', 'Square'];
    const hasPopup = !annotation.parentType || ignoredParents.includes(annotation.parentType);

    React.useLayoutEffect(() => {
        if (!annotation.parentId) {
            return;
        }
        const parent = document.querySelector(`[data-annotation-id="${annotation.parentId}"]`) as HTMLElement;
        const container = document.querySelector(`[data-annotation-id="${annotation.id}"]`) as HTMLElement;
        if (!parent || !container) {
            return;
        }
        const parentLeft = parseFloat(parent.style.left);
        const parentWidth = parseFloat(parent.style.width);
        container.style.left = `${parentLeft + parentWidth}px`;
        container.style.transformOrigin = `-${parentLeft + parentWidth}px -${parent.style.top}`;
    }, []);

    return (
        <Annotation annotation={annotation} hasPopup={hasPopup} isRenderable={isRenderable} page={page} viewport={viewport}>
            {(props) => (
                <div
                    {...props.slot.attrs}
                    data-annotation-id={annotation.id}
                >
                    <PopupWrapper annotation={annotation} />
                </div>
            )}
        </Annotation>
    );
};

export default Popup;
