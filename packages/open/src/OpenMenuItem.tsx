/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { LocalizationContext, MenuItem } from '@react-pdf-viewer/core';

import { OpenFileIcon } from './OpenFileIcon';
import type { RenderOpenProps } from './types/RenderOpenProps';

export const OpenMenuItem: React.FC<RenderOpenProps> = ({ onClick }) => {
    const l10n = React.useContext(LocalizationContext);
    const label = l10n && l10n.open ? l10n.open.openFile : 'Open file';

    const inputRef = React.createRef<HTMLInputElement>();

    const openFileDialog = () => {
        const inputEle = inputRef.current;
        if (inputEle) {
            inputEle.click();
        }
    };

    return (
        <MenuItem icon={<OpenFileIcon />} onClick={openFileDialog}>
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
