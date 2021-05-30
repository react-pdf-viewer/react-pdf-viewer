/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import downloadFile from '../utils/downloadFile';
import PdfJs from '../vendors/PdfJs';
import Annotation from './Annotation';

interface FileAttachmentProps {
    annotation: PdfJs.Annotation;
    page: PdfJs.Page;
    viewport: PdfJs.ViewPort;
}

const FileAttachment: React.FC<FileAttachmentProps> = ({ annotation, page, viewport }) => {
    const hasPopup = annotation.hasPopup === false && (!!annotation.title || !!annotation.contents);

    const doubleClick = (): void => {
        const file = annotation.file;
        file && downloadFile(file.filename, file.content);
    };

    return (
        <Annotation annotation={annotation} hasPopup={hasPopup} ignoreBorder={true} isRenderable={true} page={page} viewport={viewport}>
            {(props): React.ReactElement => (
                <div
                    {...props.slot.attrs}
                    className='rpv-core__annotation rpv-core__annotation--file-attachment'
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

export default FileAttachment;
