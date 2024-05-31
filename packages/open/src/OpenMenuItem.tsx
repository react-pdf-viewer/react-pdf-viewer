/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import { LocalizationContext, MenuItem, type LocalizationMap, type Store } from '@react-pdf-viewer/core';
import * as React from 'react';
import { OpenFileIcon } from './OpenFileIcon';
import { type StoreProps } from './types/StoreProps';
import { useTriggerOpen } from './useTriggerOpen';

export const OpenMenuItem: React.FC<{
    store: Store<StoreProps>;
    onClick(e: React.ChangeEvent<HTMLInputElement>): void;
}> = ({ store, onClick }) => {
    const { l10n } = React.useContext(LocalizationContext);
    const label = l10n && l10n.open ? ((l10n.open as LocalizationMap).openFile as string) : 'Open file';

    const { inputRef, openFile } = useTriggerOpen(store);

    return (
        <MenuItem icon={<OpenFileIcon />} testId="open__menu" onClick={openFile}>
            <div className="rpv-open__input-wrapper">
                <input
                    accept=".pdf"
                    ref={inputRef}
                    className="rpv-open__input"
                    multiple={false}
                    tabIndex={-1}
                    title=""
                    type="file"
                    onChange={onClick}
                />
                {label}
            </div>
        </MenuItem>
    );
};
