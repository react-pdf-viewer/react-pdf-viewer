/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import { isFullScreenEnabled, LocalizationContext, MenuItem, type LocalizationMap } from '@react-pdf-viewer/core';
import * as React from 'react';
import { FullScreenIcon } from './FullScreenIcon';

export interface EnterFullScreenMenuItemProps {
    onClick(): void;
}

export const EnterFullScreenMenuItem: React.FC<EnterFullScreenMenuItemProps> = ({ onClick }) => {
    const { l10n } = React.useContext(LocalizationContext);
    const label =
        l10n && l10n.fullScreen ? ((l10n.fullScreen as LocalizationMap).enterFullScreen as string) : 'Full screen';

    return (
        <MenuItem
            icon={<FullScreenIcon />}
            isDisabled={!isFullScreenEnabled()}
            testId="full-screen__enter-menu"
            onClick={onClick}
        >
            {label}
        </MenuItem>
    );
};
