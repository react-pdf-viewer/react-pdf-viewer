/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import {
    LocalizationContext,
    MinimalButton,
    Position,
    Tooltip,
    isMac,
    type LocalizationMap,
    type Store,
} from '@react-pdf-viewer/core';
import * as React from 'react';
import { OpenFileIcon } from './OpenFileIcon';
import styles from './styles/openInput.module.css';
import { type StoreProps } from './types/StoreProps';
import { useTriggerOpen } from './useTriggerOpen';

export const OpenButton: React.FC<{
    enableShortcuts: boolean;
    store: Store<StoreProps>;
    onClick(e: React.ChangeEvent<HTMLInputElement>): void;
}> = ({ enableShortcuts, store, onClick }) => {
    const { l10n } = React.useContext(LocalizationContext);
    const label = l10n && l10n.open ? ((l10n.open as LocalizationMap).openFile as string) : 'Open file';

    const { inputRef, openFile } = useTriggerOpen(store);
    const ariaKeyShortcuts = enableShortcuts ? (isMac() ? 'Meta+O' : 'Ctrl+O') : '';

    return (
        <Tooltip
            ariaControlsSuffix="open"
            position={Position.BottomCenter}
            target={
                <div className={styles.container}>
                    <input
                        accept=".pdf"
                        className={styles.input}
                        multiple={false}
                        ref={inputRef}
                        tabIndex={-1}
                        title=""
                        type="file"
                        onChange={onClick}
                    />
                    <MinimalButton
                        ariaKeyShortcuts={ariaKeyShortcuts}
                        ariaLabel={label}
                        testId="open__button"
                        onClick={openFile}
                    >
                        <OpenFileIcon />
                    </MinimalButton>
                </div>
            }
            content={() => label}
        />
    );
};
