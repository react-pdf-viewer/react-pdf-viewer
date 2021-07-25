/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { LocalizationContext, MinimalButton, Position, Tooltip } from '@react-pdf-viewer/core';

import { RotateBackwardIcon } from './RotateBackwardIcon';
import { RotateForwardIcon } from './RotateForwardIcon';
import { RotateDirection } from './structs/RotateDirection';
import type { RenderRotateProps } from './types/RenderRotateProps';

const TOOLTIP_OFFSET = { left: 0, top: 8 };

export const RotateButton: React.FC<RenderRotateProps> = ({ direction, onClick }) => {
    const l10n = React.useContext(LocalizationContext);

    const backwardLabel = l10n && l10n.rotate ? l10n.rotate.rotateBackward : 'Rotate counterclockwise';
    const forwardLabel = l10n && l10n.rotate ? l10n.rotate.rotateForward : 'Rotate clockwise';
    const label = direction === RotateDirection.Backward ? backwardLabel : forwardLabel;
    const icon = direction === RotateDirection.Backward ? <RotateBackwardIcon /> : <RotateForwardIcon />;

    return (
        <Tooltip
            ariaControlsSuffix="rotate"
            position={Position.BottomCenter}
            target={
                <MinimalButton ariaLabel={label as string} onClick={onClick}>
                    {icon}
                </MinimalButton>
            }
            content={() => label}
            offset={TOOLTIP_OFFSET}
        />
    );
};
