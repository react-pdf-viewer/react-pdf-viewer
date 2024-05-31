/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import { LocalizationContext, MenuItem, type LocalizationMap } from '@react-pdf-viewer/core';
import * as React from 'react';
import { ZoomOutIcon } from './ZoomOutIcon';
import { type ZoomMenuItemProps } from './types/ZoomMenuItemProps';

export const ZoomOutMenuItem: React.FC<ZoomMenuItemProps> = ({ onClick }) => {
    const { l10n } = React.useContext(LocalizationContext);
    const label = l10n && l10n.zoom ? ((l10n.zoom as LocalizationMap).zoomOut as string) : 'Zoom out';

    return (
        <MenuItem icon={<ZoomOutIcon />} testId="zoom__out-menu" onClick={onClick}>
            {label}
        </MenuItem>
    );
};
