/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { isMac, LocalizationContext, MinimalButton, Position, Tooltip } from '@react-pdf-viewer/core';
import type { Store } from '@react-pdf-viewer/core';

import { OpenFileIcon } from './OpenFileIcon';
import { useTriggerOpen } from './useTriggerOpen';
import type { StoreProps } from './types/StoreProps';

const TOOLTIP_OFFSET = { left: 0, top: 8 };

export const OpenButton: React.FC<{
    enableShortcuts: boolean;
    store: Store<StoreProps>;
    onClick(e: React.ChangeEvent<HTMLInputElement>): void;
}> = ({ enableShortcuts, store, onClick }) => {
    const { l10n } = React.useContext(LocalizationContext);
    const label = l10n && l10n.open ? l10n.open.openFile : 'Open file';

    const { inputRef, openFile } = useTriggerOpen(store);
    const ariaKeyShortcuts = enableShortcuts ? (isMac() ? 'Meta+O' : 'Ctrl+O') : '';

    return (
        <Tooltip
            ariaControlsSuffix="open"
            position={Position.BottomCenter}
            target={
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
                    <MinimalButton ariaKeyShortcuts={ariaKeyShortcuts} ariaLabel={label as string} onClick={openFile}>
                        <OpenFileIcon />
                    </MinimalButton>
                </div>
            }
            content={() => label}
            offset={TOOLTIP_OFFSET}
        />
    );
};
