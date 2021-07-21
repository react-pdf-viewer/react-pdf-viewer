/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { LocalizationContext, PdfJs, Spinner } from '@react-pdf-viewer/core';

import AttachmentList from './AttachmentList';
import FileItem from './FileItem';

interface AttachmentLoaderProps {
    doc: PdfJs.PdfDocument;
}

interface AttachmentState {
    files: FileItem[];
    isLoaded: boolean;
}

const AttachmentLoader: React.FC<AttachmentLoaderProps> = ({ doc }) => {
    const l10n = React.useContext(LocalizationContext);
    const noAttachmentLabel = l10n && l10n.attachment ? l10n.attachment.noAttachment : 'There is no attachment';

    const [attachments, setAttachments] = React.useState<AttachmentState>({
        files: [],
        isLoaded: false,
    });

    React.useEffect(() => {
        doc.getAttachments().then((response) => {
            const files = response
                ? Object.keys(response).map((file) => {
                      return {
                          data: response[file].content,
                          fileName: response[file].filename,
                      };
                  })
                : [];
            setAttachments({
                files,
                isLoaded: true,
            });
        });
    }, [doc]);

    return !attachments.isLoaded ? (
        <Spinner />
    ) : attachments.files.length === 0 ? (
        <div className="rpv-attachment__empty">{noAttachmentLabel}</div>
    ) : (
        <AttachmentList files={Array(10).fill(attachments.files).flat()} />
    );
};

export default AttachmentLoader;
