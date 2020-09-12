/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useContext } from 'react';
import { LocalizationContext } from '@react-pdf-viewer/core';

import downloadFile from './downloadFile';
import FileItem from './FileItem';

interface AttachmentListProps {
    files: FileItem[];
}

const AttachmentList: React.FC<AttachmentListProps> = ({ files }) => {
    const l10n = useContext(LocalizationContext);

    const renderItem = (file: FileItem): React.ReactElement => {
        const onClick = (): void => downloadFile(file.fileName, file.data);
        return (
            <li
                className='rpv-attachment-item'
                key={`attachment-${file.fileName}`}
                title={
                    (
                        l10n && l10n.attachment
                            ? l10n.attachment.clickToDownload
                            : 'Click to download'
                    ) as string
                }
                onClick={onClick}
            >
                {file.fileName}
            </li>
        );
    };

    return (
        files.length === 0
            ? <div className='rpv-attachment-list-empty'>
                {
                    l10n && l10n.attachment
                    ? l10n.attachment.noAttachment
                    : 'There is no attachment'
                }
            </div>
            : (
                <ul className='rpv-attachment-list'>
                    {
                        files.map(renderItem)
                    }
                </ul>
            )
    );
};

export default AttachmentList;
