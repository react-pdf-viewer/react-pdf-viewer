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

    const handleKeyDown = (e: React.KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                moveToItem((items, activeEle) => items.indexOf(activeEle) + 1);
                break;

            case 'ArrowUp':
                e.preventDefault();
                moveToItem((items, activeEle) => items.indexOf(activeEle) - 1);
                break;

            case 'End':
                e.preventDefault();
                moveToItem((items, _) => items.length - 1);
                break;

            case 'Home':
                e.preventDefault();
                moveToItem((_, __) => 0);
                break;

            default:
                break;
        }
    };

    const moveToItem = (getItemIndex: (attachmentItems: Element[], activeElement: Element) => number) => {
        const container = containerRef.current;
        const attachmentItems: Element[] = [].slice.call(container.getElementsByClassName('rpv-attachment__item'));
        if (attachmentItems.length === 0) {
            return;
        }
        attachmentItems.forEach((item) => item.setAttribute('tabindex', '-1'));

        const activeEle = document.activeElement;

        const targetIndex = Math.min(
            attachmentItems.length - 1,
            Math.max(0, getItemIndex(attachmentItems, activeEle as HTMLElement))
        );
        const targetEle = attachmentItems[targetIndex];

        targetEle.setAttribute('tabindex', '0');
        (targetEle as HTMLElement).focus();
    };

    useIsomorphicLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }

        const attachmentItems: HTMLElement[] = [].slice.call(container.getElementsByClassName('rpv-attachment__item'));
        attachmentItemsRef.current = attachmentItems;

        // Focus the first attachment item automatically
        if (attachmentItems.length > 0) {
            const firstItem = attachmentItems[0];
            firstItem.focus();
            firstItem.setAttribute('tabindex', '0');
        }
    }, []);

    return (
        <div className="rpv-attachment__list" ref={containerRef} tabIndex={-1} onKeyDown={handleKeyDown}>
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
