/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { isMac, LocalizationContext, MinimalButton, Position, Tooltip } from '@react-pdf-viewer/core';

import { ZoomOutIcon } from './ZoomOutIcon';
import type { RenderZoomOutProps } from './types/RenderZoomOutProps';

const TOOLTIP_OFFSET = { left: 0, top: 8 };

export const ZoomOutButton: React.FC<RenderZoomOutProps> = ({ enableShortcuts, onClick }) => {
    const { l10n } = React.useContext(LocalizationContext);
    const label = l10n && l10n.zoom ? l10n.zoom.zoomOut : 'Zoom out';
    const ariaKeyShortcuts = enableShortcuts ? (isMac() ? 'Meta+-' : 'Ctrl+-') : '';

    return (
        <Tooltip
            ariaControlsSuffix="zoom-out"
            position={Position.BottomCenter}
            target={
                <MinimalButton
                    ariaKeyShortcuts={ariaKeyShortcuts}
                    ariaLabel={label as string}
                    testId="zoom__out-button"
                    onClick={onClick}
                >
                    <ZoomOutIcon />
                </MinimalButton>
            }
            content={() => label}
            offset={TOOLTIP_OFFSET}
        />
    );
};
