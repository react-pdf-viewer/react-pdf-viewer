/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useEffect, useState } from 'react';

import Spinner from '../components/Spinner';
import PdfJs from '../vendors/PdfJs';
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
    const [attachments, setAttachments] = useState<AttachmentState>({
        files: [],
        isLoaded: false,
    });

    useEffect(() => {
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
    }, []);

    return (
        !attachments.isLoaded
            ? <Spinner />
            : <AttachmentList files={attachments.files} />
    );
};

export default AttachmentLoader;
