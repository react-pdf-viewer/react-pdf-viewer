/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import { LocalizationContext, MenuItem, RotateDirection, type LocalizationMap } from '@react-pdf-viewer/core';
import * as React from 'react';
import { RotateBackwardIcon } from './RotateBackwardIcon';
import { RotateForwardIcon } from './RotateForwardIcon';
import { type RenderRotateProps } from './types/RenderRotateProps';

export const RotateMenuItem: React.FC<RenderRotateProps> = ({ direction, onClick }) => {
    const { l10n } = React.useContext(LocalizationContext);

    const backwardLabel =
        l10n && l10n.rotate ? ((l10n.rotate as LocalizationMap).rotateBackward as string) : 'Rotate counterclockwise';
    const forwardLabel =
        l10n && l10n.rotate ? ((l10n.rotate as LocalizationMap).rotateForward as string) : 'Rotate clockwise';
    const label = direction === RotateDirection.Backward ? backwardLabel : forwardLabel;
    const icon = direction === RotateDirection.Backward ? <RotateBackwardIcon /> : <RotateForwardIcon />;

    return (
        <MenuItem
            icon={icon}
            testId={direction === RotateDirection.Backward ? 'rotate__backward-menu' : 'rotate__forward-menu'}
            onClick={onClick}
        >
            {label}
        </MenuItem>
    );
};
