/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { LocalizationContext, MenuItem } from '@react-pdf-viewer/core';

import { RenderOpenProps } from './Open';
import OpenFileIcon from './OpenFileIcon';

const OpenMenuItem: React.FC<RenderOpenProps> = ({ onClick }) => {
    const l10n = React.useContext(LocalizationContext);
    const label = l10n && l10n.open ? l10n.open.openFile : 'Open file';

    return (
        <MenuItem icon={<OpenFileIcon />} onClick={() => {}}>
            <div className='rpv-open__input-wrapper'>
                <input
                    className='rpv-open__input'
                    multiple={false}
                    type='file'
                    title=''
                    onChange={onClick}
                />
                {label}
            </div>
        </MenuItem>
    );
};

export default OpenMenuItem;
