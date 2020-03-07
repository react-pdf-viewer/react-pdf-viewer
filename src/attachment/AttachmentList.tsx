/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import LocalizationContext from '../localization/LocalizationContext';
import ThemeContent from '../theme/ThemeContext';
import downloadFile from '../utils/downloadFile';
import './attachmentList.less';
import FileItem from './FileItem';

interface AttachmentListProps {
    files: FileItem[];
}

const AttachmentList: React.FC<AttachmentListProps> = ({ files }) => {
    const l10n = React.useContext(LocalizationContext);
    const theme = React.useContext(ThemeContent);

    const renderItem = (file: FileItem) => {
        const onClick = () => downloadFile(file.fileName, file.data);
        return (
            <li
                className={`${theme.prefixClass}-attachment-item`}
                key={`attachment-${file.fileName}`}
                title={`${l10n.attachment.clickToDownload}`}
                onClick={onClick}
            >
                {file.fileName}
            </li>
        );
    };

    return (
        files.length === 0
            ? <div className={`${theme.prefixClass}-attachment-list-empty`}>{l10n.attachment.noAttachment}</div>
            : (
                <ul className={`${theme.prefixClass}-attachment-list`}>
                    {
                        files.map(renderItem)
                    }
                </ul>
            )
    );
};

export default AttachmentList;
