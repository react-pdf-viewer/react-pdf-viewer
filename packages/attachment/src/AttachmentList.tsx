/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { LocalizationContext, useIsomorphicLayoutEffect } from '@react-pdf-viewer/core';

import downloadFile from './downloadFile';
import FileItem from './FileItem';

interface AttachmentListProps {
    files: FileItem[];
}

const AttachmentList: React.FC<AttachmentListProps> = ({ files }) => {
    const containerRef = React.useRef<HTMLDivElement>();
    const l10n = React.useContext(LocalizationContext);
    const attachmentItemsRef = React.useRef<HTMLElement[]>([]);

    const clickDownloadLabel = l10n && l10n.attachment ? l10n.attachment.clickToDownload : 'Click to download';

    useIsomorphicLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }

        const items: HTMLElement[] = [].slice.call(container.getElementsByClassName('rpv-attachment__item'));
        attachmentItemsRef.current = items;

        // Focus the first attachment item automatically
        if (items.length > 0) {
            const firstItem = items[0];
            firstItem.focus();
            firstItem.setAttribute('tabindex', '0');
        }
    }, []);

    return (
        <div className="rpv-attachment__list" ref={containerRef}>
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
