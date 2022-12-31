/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { LocalizationMap } from '@react-pdf-viewer/core';
import {
    classNames,
    LocalizationContext,
    TextDirection,
    ThemeContext,
    useIsomorphicLayoutEffect,
} from '@react-pdf-viewer/core';
import * as React from 'react';
import { downloadFile } from './downloadFile';
import type { FileItem } from './types/FileItem';

export const AttachmentList: React.FC<{
    files: FileItem[];
}> = ({ files }) => {
    const containerRef = React.useRef<HTMLDivElement>();
    const { l10n } = React.useContext(LocalizationContext);
    const { direction } = React.useContext(ThemeContext);
    const isRtl = direction === TextDirection.RightToLeft;
    const attachmentItemsRef = React.useRef<HTMLElement[]>([]);

    const clickDownloadLabel =
        l10n && l10n.attachment
            ? ((l10n.attachment as LocalizationMap).clickToDownload as string)
            : 'Click to download';

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
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                moveToItem((items, _) => items.length - 1);
                break;

            case 'Home':
                e.preventDefault();
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        <div
            data-testid="attachment__list"
            className={classNames({
                'rpv-attachment__list': true,
                'rpv-attachment__list--rtl': isRtl,
            })}
            ref={containerRef}
            tabIndex={-1}
            onKeyDown={handleKeyDown}
        >
            {files.map((file) => (
                <button
                    className="rpv-attachment__item"
                    key={file.fileName}
                    tabIndex={-1}
                    title={clickDownloadLabel}
                    type="button"
                    onClick={() => downloadFile(file.fileName, file.data)}
                >
                    {file.fileName}
                </button>
            ))}
        </div>
    );
};
