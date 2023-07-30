/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
import { type PdfJs } from '../types/PdfJs';
import { Annotation } from './Annotation';
import { PopupWrapper } from './PopupWrapper';
import { getContents } from './getContents';
import { getTitle } from './getTitle';

export const Popup: React.FC<{
    annotation: PdfJs.Annotation;
    page: PdfJs.Page;
    viewport: PdfJs.ViewPort;
}> = ({ annotation, page, viewport }) => {
    const title = getTitle(annotation);
    const contents = getContents(annotation);
    const isRenderable = !!(title || contents);

    // Don't render the popup for annotation whose parent renders the annotation themselves
    const ignoredParents = ['Circle', 'Ink', 'Line', 'Polygon', 'PolyLine', 'Square'];
    const hasPopup = !annotation.parentType || ignoredParents.indexOf(annotation.parentType) !== -1;

    useIsomorphicLayoutEffect(() => {
        if (!annotation.parentId) {
            return;
        }
        const parent = document.querySelector(`[data-annotation-id="${annotation.parentId}"]`) as HTMLElement;
        const container = document.querySelector(`[data-annotation-id="${annotation.id}"]`) as HTMLElement;
        if (!parent || !container) {
            return;
        }
        const left = parseFloat(parent.style.left);
        const top = parseFloat(parent.style.top) + parseFloat(parent.style.height);

        container.style.left = `${left}px`;
        container.style.top = `${top}px`;
        container.style.transformOrigin = `-${left}px -${top}px`;
    }, []);

    return (
        <Annotation
            annotation={annotation}
            hasPopup={hasPopup}
            ignoreBorder={false}
            isRenderable={isRenderable}
            page={page}
            viewport={viewport}
        >
            {(props): React.ReactElement => (
                <div
                    {...props.slot.attrs}
                    className="rpv-core__annotation rpv-core__annotation--popup"
                    data-annotation-id={annotation.id}
                >
                    <PopupWrapper annotation={annotation} />
                </div>
            )}
        </Annotation>
    );
};
