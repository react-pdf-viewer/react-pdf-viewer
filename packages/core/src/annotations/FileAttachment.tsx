/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import type { PdfJs } from '../types/PdfJs';
import { downloadFile } from '../utils/downloadFile';
import { Annotation } from './Annotation';
import { getContents } from './getContents';
import { getTitle } from './getTitle';

export const FileAttachment: React.FC<{
    annotation: PdfJs.Annotation;
    page: PdfJs.Page;
    viewport: PdfJs.ViewPort;
}> = ({ annotation, page, viewport }) => {
    const title = getTitle(annotation);
    const contents = getContents(annotation);
    const hasPopup = annotation.hasPopup === false && (!!title || !!contents);

    const doubleClick = (): void => {
        const file = annotation.file;
        file && downloadFile(file.filename, file.content);
    };

    return (
        <Annotation
            annotation={annotation}
            hasPopup={hasPopup}
            ignoreBorder={true}
            isRenderable={true}
            page={page}
            viewport={viewport}
        >
            {(props): React.ReactElement => (
                <div
                    {...props.slot.attrs}
                    className="rpv-core__annotation rpv-core__annotation--file-attachment"
                    data-annotation-id={annotation.id}
                    onClick={props.popup.toggleOnClick}
                    onDoubleClick={doubleClick}
                    onMouseEnter={props.popup.openOnHover}
                    onMouseLeave={props.popup.closeOnHover}
                >
                    {props.slot.children}
                </div>
            )}
        </Annotation>
    );
};
