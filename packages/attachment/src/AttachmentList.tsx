/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { LocalizationContext } from '@react-pdf-viewer/core';

import downloadFile from './downloadFile';
import FileItem from './FileItem';

interface AttachmentListProps {
    files: FileItem[];
}

const AttachmentList: React.FC<AttachmentListProps> = ({ files }) => {
    const l10n = React.useContext(LocalizationContext);
    const noAttachmentLabel = l10n && l10n.attachment ? l10n.attachment.noAttachment : 'There is no attachment';
    const clickDownloadLabel = l10n && l10n.attachment ? l10n.attachment.clickToDownload : 'Click to download';

    return files.length === 0 ? (
        <div className="rpv-attachment__empty">{noAttachmentLabel}</div>
    ) : (
        <div className="rpv-attachment__list">
            {files.map((file) => (
                <button
                    className="rpv-attachment__item"
                    key={file.fileName}
                    tabIndex={-1}
                    title={clickDownloadLabel as string}
                    type="button"
                    onClick={() => downloadFile(file.fileName, file.data)}
                >
                    {file.fileName}
                </button>
            ))}
        </div>
    );
};

export default AttachmentList;
