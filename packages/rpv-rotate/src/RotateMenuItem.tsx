/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { FC, useContext } from 'react';
import { LocalizationContext, MenuItem } from '@phuocng/rpv';

import { RenderRotateProps } from './Rotate';
import RotateBackwardIcon from './RotateBackwardIcon';
import RotateForwardIcon from './RotateForwardIcon';
import RotateDirection from './RotateDirection';

const RotateMenuItem: FC<RenderRotateProps> = ({ direction, onClick }) => {
    const l10n = useContext(LocalizationContext);

    const backwardLabel = (l10n && l10n.plugins && l10n.plugins.rotate)
            ? l10n.plugins.rotate.rotateBackward
            : 'Rotate counterclockwise';
    const forwardLabel = (l10n && l10n.plugins && l10n.plugins.rotate)
        ? l10n.plugins.rotate.rotateForward
        : 'Rotate clockwise';
    const label = (direction === RotateDirection.Backward) ? backwardLabel : forwardLabel;
    const icon = (direction === RotateDirection.Backward) ? <RotateBackwardIcon /> : <RotateForwardIcon />;

    return (
        <MenuItem icon={icon} onClick={onClick}>
            {label}
        </MenuItem>
    );
};

export default RotateMenuItem;
