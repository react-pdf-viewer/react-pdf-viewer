/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { LocalizationContext, MenuItem } from '@react-pdf-viewer/core';

import { ZoomOutIcon } from './ZoomOutIcon';
import type { ZoomMenuItemProps } from './types/ZoomMenuItemProps';

export const ZoomOutMenuItem: React.FC<ZoomMenuItemProps> = ({ onClick }) => {
    const { l10n } = React.useContext(LocalizationContext);
    const label = l10n && l10n.zoom ? l10n.zoom.zoomOut : 'Zoom out';

    return (
        <MenuItem icon={<ZoomOutIcon />} testId="zoom__out-menu" onClick={onClick}>
            {label}
        </MenuItem>
    );
};
