/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { LocalizationMap } from '@react-pdf-viewer/core';
import { isMac, LocalizationContext, MinimalButton, Position, Tooltip } from '@react-pdf-viewer/core';
import * as React from 'react';
import type { RenderZoomInProps } from './types/RenderZoomInProps';
import { ZoomInIcon } from './ZoomInIcon';

const TOOLTIP_OFFSET = { left: 0, top: 8 };

export const ZoomInButton: React.FC<RenderZoomInProps> = ({ enableShortcuts, onClick }) => {
    const { l10n } = React.useContext(LocalizationContext);
    const label = l10n && l10n.zoom ? ((l10n.zoom as LocalizationMap).zoomIn as string) : 'Zoom in';
    const ariaKeyShortcuts = enableShortcuts ? (isMac() ? 'Meta+=' : 'Ctrl+=') : '';

    return (
        <Tooltip
            ariaControlsSuffix="zoom-in"
            position={Position.BottomCenter}
            target={
                <MinimalButton
                    ariaKeyShortcuts={ariaKeyShortcuts}
                    ariaLabel={label}
                    testId="zoom__in-button"
                    onClick={onClick}
                >
                    <ZoomInIcon />
                </MinimalButton>
            }
            content={() => label}
            offset={TOOLTIP_OFFSET}
        />
    );
};
