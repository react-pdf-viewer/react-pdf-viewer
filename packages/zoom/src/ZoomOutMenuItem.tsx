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
import type { ZoomMenuItemProps } from './types/ZoomMenuItemProps';
import { ZoomOutIcon } from './ZoomOutIcon';

export const ZoomOutMenuItem: React.FC<ZoomMenuItemProps> = ({ onClick }) => {
    const { l10n } = React.useContext(LocalizationContext);
    const label = l10n && l10n.zoom ? ((l10n.zoom as LocalizationMap).zoomOut as string) : 'Zoom out';

    return (
        <MenuItem icon={<ZoomOutIcon />} testId="zoom__out-menu" onClick={onClick}>
            {label}
        </MenuItem>
    );
};
