/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { PdfJs, Spinner } from '@react-pdf-viewer/core';

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

    return (
        !attachments.isLoaded
            ? <Spinner />
            : <AttachmentList files={attachments.files} />
    );
};

export default AttachmentLoader;
