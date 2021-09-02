/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { LocalizationContext, MenuItem } from '@react-pdf-viewer/core';
import type { Store } from '@react-pdf-viewer/core';

import { OpenFileIcon } from './OpenFileIcon';
import { useTriggerOpen } from './useTriggerOpen';
import type { StoreProps } from './types/StoreProps';

export const OpenMenuItem: React.FC<{
    store: Store<StoreProps>;
    onClick(e: React.ChangeEvent<HTMLInputElement>): void;
}> = ({ store, onClick }) => {
    const { l10n } = React.useContext(LocalizationContext);
    const label = l10n && l10n.open ? l10n.open.openFile : 'Open file';

    const { inputRef, openFile } = useTriggerOpen(store);

    return (
        <MenuItem icon={<OpenFileIcon />} onClick={openFile}>
            <div className="rpv-open__input-wrapper">
                <input
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
