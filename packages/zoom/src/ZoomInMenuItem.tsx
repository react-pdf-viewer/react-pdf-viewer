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
import { ZoomInIcon } from './ZoomInIcon';
import { type ZoomMenuItemProps } from './types/ZoomMenuItemProps';

export const ZoomInMenuItem: React.FC<ZoomMenuItemProps> = ({ onClick }) => {
    const { l10n } = React.useContext(LocalizationContext);
    const label = l10n && l10n.zoom ? ((l10n.zoom as LocalizationMap).zoomIn as string) : 'Zoom in';

    return (
        <MenuItem icon={<ZoomInIcon />} testId="zoom__in-menu" onClick={onClick}>
            {label}
        </MenuItem>
    );
};
