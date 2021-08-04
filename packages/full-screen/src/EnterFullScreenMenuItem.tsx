/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { LocalizationContext, MenuItem } from '@react-pdf-viewer/core';

import { FullScreenIcon } from './FullScreenIcon';

export interface EnterFullScreenMenuItemProps {
    onClick(): void;
}

export const EnterFullScreenMenuItem: React.FC<EnterFullScreenMenuItemProps> = ({ onClick }) => {
    const { l10n } = React.useContext(LocalizationContext);
    const label = l10n && l10n.fullScreen ? l10n.fullScreen.enterFullScreen : 'Full screen';

    return (
        <MenuItem icon={<FullScreenIcon />} onClick={onClick}>
            {label}
        </MenuItem>
    );
};
