/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { LocalizationMap } from '@react-pdf-viewer/core';
import { LocalizationContext, MenuItem } from '@react-pdf-viewer/core';
import * as React from 'react';
import { PrintIcon } from './PrintIcon';

export interface PrintMenuItemProps {
    onClick(): void;
}

export const PrintMenuItem: React.FC<PrintMenuItemProps> = ({ onClick }) => {
    const { l10n } = React.useContext(LocalizationContext);
    const label = l10n && l10n.print ? ((l10n.print as LocalizationMap).print as string) : 'Print';

    return (
        <MenuItem icon={<PrintIcon />} testId="print__menu" onClick={onClick}>
            {label}
        </MenuItem>
    );
};
