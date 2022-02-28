/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { isMac, LocalizationContext, MinimalButton, Position, Tooltip } from '@react-pdf-viewer/core';

import { isFullScreenEnabled } from './fullScreen';
import { FullScreenIcon } from './FullScreenIcon';

const TOOLTIP_OFFSET = { left: 0, top: 8 };

export const EnterFullScreenButton: React.FC<{
    enableShortcuts: boolean;
    onClick(): void;
}> = ({ enableShortcuts, onClick }) => {
    const { l10n } = React.useContext(LocalizationContext);
    const label = l10n && l10n.fullScreen ? l10n.fullScreen.enterFullScreen : 'Full screen';
    const ariaKeyShortcuts = enableShortcuts ? (isMac() ? 'Meta+Ctrl+F' : 'F11') : '';

    return (
        <Tooltip
            ariaControlsSuffix="full-screen-enter"
            position={Position.BottomCenter}
            target={
                <MinimalButton
                    ariaKeyShortcuts={ariaKeyShortcuts}
                    ariaLabel={label as string}
                    isDisabled={!isFullScreenEnabled()}
                    testId="full-screen__enter-button"
                    onClick={onClick}
                >
                    <FullScreenIcon />
                </MinimalButton>
            }
            content={() => label}
            offset={TOOLTIP_OFFSET}
        />
    );
};
