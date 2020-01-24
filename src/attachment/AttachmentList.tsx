/**
 * A React component to view a PDF document
 * 
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import LocalizationContext from '../localization/LocalizationContext';
import downloadFile from '../utils/downloadFile';
import './attachmentList.css';
import FileItem from './FileItem';

interface AttachmentListProps {
    files: FileItem[];
}

const AttachmentList: React.FC<AttachmentListProps> = ({ files }) => {
    const l10n = React.useContext(LocalizationContext);

    const renderItem = (file: FileItem) => {
        const onClick = () => downloadFile(file.fileName, file.data);
        return (
            <li
                className="viewer-attachment-item"
                key={`attachment-${file.fileName}`}
                style={{ padding: '8px' }}
                title={`${l10n.attachment.clickToDownload}`}
                onClick={onClick}
            >
                {file.fileName}
            </li>
        );
    };

    return (
        files.length === 0
            ? <div>{l10n.attachment.noAttachment}</div>
            : (
                <ul
                    style={{
                        listStyleType: 'none',
                        margin: '0',
                        padding: '0',
                        width: '100%',
                    }}
                >
                    {
                        files.map(renderItem)
                    }
                </ul>
            )
    );
};

export default AttachmentList;
