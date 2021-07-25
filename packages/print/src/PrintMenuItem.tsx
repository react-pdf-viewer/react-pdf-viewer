/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { LocalizationContext, MenuItem } from '@react-pdf-viewer/core';

import { PrintIcon } from './PrintIcon';

export interface PrintMenuItemProps {
    onClick(): void;
}

export const PrintMenuItem: React.FC<PrintMenuItemProps> = ({ onClick }) => {
    const l10n = React.useContext(LocalizationContext);
    const label = l10n && l10n.print ? l10n.print.print : 'Print';

    return (
        <MenuItem icon={<PrintIcon />} onClick={onClick}>
            {label}
        </MenuItem>
    );
};
