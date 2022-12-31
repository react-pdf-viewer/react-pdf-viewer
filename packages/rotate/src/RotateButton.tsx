/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { LocalizationMap } from '@react-pdf-viewer/core';
import { LocalizationContext, MinimalButton, Position, RotateDirection, Tooltip } from '@react-pdf-viewer/core';
import * as React from 'react';
import { RotateBackwardIcon } from './RotateBackwardIcon';
import { RotateForwardIcon } from './RotateForwardIcon';
import type { RenderRotateProps } from './types/RenderRotateProps';

const TOOLTIP_OFFSET = { left: 0, top: 8 };

export const RotateButton: React.FC<RenderRotateProps> = ({ direction, onClick }) => {
    const { l10n } = React.useContext(LocalizationContext);

    const backwardLabel =
        l10n && l10n.rotate ? ((l10n.rotate as LocalizationMap).rotateBackward as string) : 'Rotate counterclockwise';
    const forwardLabel =
        l10n && l10n.rotate ? ((l10n.rotate as LocalizationMap).rotateForward as string) : 'Rotate clockwise';
    const label = direction === RotateDirection.Backward ? backwardLabel : forwardLabel;
    const icon = direction === RotateDirection.Backward ? <RotateBackwardIcon /> : <RotateForwardIcon />;

    return (
        <Tooltip
            ariaControlsSuffix="rotate"
            position={Position.BottomCenter}
            target={
                <MinimalButton
                    ariaLabel={label}
                    testId={
                        direction === RotateDirection.Backward ? 'rotate__backward-button' : 'rotate__forward-button'
                    }
                    onClick={onClick}
                >
                    {icon}
                </MinimalButton>
            }
            content={() => label}
            offset={TOOLTIP_OFFSET}
        />
    );
};
