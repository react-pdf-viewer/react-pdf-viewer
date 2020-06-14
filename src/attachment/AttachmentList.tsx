/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useContext } from 'react';

import LocalizationContext from '../localization/LocalizationContext';
import ThemeContext from '../theme/ThemeContext';
import downloadFile from '../utils/downloadFile';
import './attachmentList.less';
import FileItem from './FileItem';

interface AttachmentListProps {
    files: FileItem[];
}

const AttachmentList: React.FC<AttachmentListProps> = ({ files }) => {
    const l10n = useContext(LocalizationContext);
    const theme = useContext(ThemeContext);

    const renderItem = (file: FileItem): React.ReactElement => {
        const onClick = (): void => downloadFile(file.fileName, file.data);
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
