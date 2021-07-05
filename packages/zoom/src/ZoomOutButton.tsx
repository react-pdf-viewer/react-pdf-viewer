/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { LocalizationContext, MinimalButton, Position, Tooltip } from '@react-pdf-viewer/core';

import { RenderZoomOutProps } from './ZoomOut';
import ZoomOutIcon from './ZoomOutIcon';

const TOOLTIP_OFFSET = { left: 0, top: 8 };

const ZoomOutButton: React.FC<RenderZoomOutProps> = ({ onClick }) => {
    const l10n = React.useContext(LocalizationContext);
    const label = l10n && l10n.zoom ? l10n.zoom.zoomOut : 'Zoom out';

    return (
        <Tooltip
            position={Position.BottomCenter}
            target={
                <MinimalButton onClick={onClick}>
                    <ZoomOutIcon />
                </MinimalButton>
            }
            content={() => label}
            offset={TOOLTIP_OFFSET}
        />
    );
};

export default ZoomOutButton;
