/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import {
    isFullScreenEnabled,
    isMac,
    LocalizationContext,
    MinimalButton,
    Position,
    Tooltip,
    type LocalizationMap,
} from '@react-pdf-viewer/core';
import * as React from 'react';
import { FullScreenIcon } from './FullScreenIcon';

export const EnterFullScreenButton: React.FC<{
    enableShortcuts: boolean;
    onClick(): void;
}> = ({ enableShortcuts, onClick }) => {
    const { l10n } = React.useContext(LocalizationContext);
    const label =
        l10n && l10n.fullScreen ? ((l10n.fullScreen as LocalizationMap).enterFullScreen as string) : 'Full screen';
    const ariaKeyShortcuts = enableShortcuts ? (isMac() ? 'Meta+Ctrl+F' : 'F11') : '';

    return (
        <Tooltip
            ariaControlsSuffix="full-screen-enter"
            position={Position.BottomCenter}
            target={
                <MinimalButton
                    ariaKeyShortcuts={ariaKeyShortcuts}
                    ariaLabel={label}
                    isDisabled={!isFullScreenEnabled()}
                    testId="full-screen__enter-button"
                    onClick={onClick}
                >
                    <FullScreenIcon />
                </MinimalButton>
            }
            content={() => label}
        />
    );
};
