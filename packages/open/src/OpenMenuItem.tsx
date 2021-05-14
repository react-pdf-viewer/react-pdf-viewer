/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { LocalizationContext, MenuItem } from '@react-pdf-viewer/core';

import OpenFileIcon from './OpenFileIcon';

export interface OpenMenuItemProps {
    onClick(): void;
}

const OpenMenuItem: React.FC<{
    onClick(): void,
    onOpenFile: (e: React.ChangeEvent<HTMLInputElement>) => void,
}> = ({ onClick, onOpenFile }) => {
    const l10n = React.useContext(LocalizationContext);
    const label = l10n && l10n.open ? l10n.open.openFile : 'Open file';

    return (
        <MenuItem icon={<OpenFileIcon />} onClick={onClick}>
            <div className='rpv-open-button'>
                <input
                    className='rpv-open-button-input'
                    multiple={false}
                    type='file'
                    title=''
                    onChange={onOpenFile}
                />
                {label}
            </div>
        </MenuItem>
    );
};

export default OpenMenuItem;
