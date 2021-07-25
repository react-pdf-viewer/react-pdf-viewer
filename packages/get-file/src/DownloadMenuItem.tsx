/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { LocalizationContext, MenuItem } from '@react-pdf-viewer/core';

import { DownloadIcon } from './DownloadIcon';

export interface DownloadMenuItemProps {
    onClick(): void;
}

export const DownloadMenuItem: React.FC<DownloadMenuItemProps> = ({ onClick }) => {
    const l10n = React.useContext(LocalizationContext);
    const label = l10n && l10n.download ? l10n.download.download : 'Download';

    return (
        <MenuItem icon={<DownloadIcon />} onClick={onClick}>
            {label}
        </MenuItem>
    );
};
