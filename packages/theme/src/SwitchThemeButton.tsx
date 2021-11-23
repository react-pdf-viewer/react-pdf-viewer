/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { LocalizationContext, MinimalButton, Position, ThemeContext, Tooltip } from '@react-pdf-viewer/core';

import { DarkIcon } from './DarkIcon';
import { LightIcon } from './LightIcon';

const TOOLTIP_OFFSET = { left: 0, top: 8 };

export const SwitchThemeButton: React.FC<{
    onClick(): void;
}> = ({ onClick }) => {
    const theme = React.useContext(ThemeContext);
    const { l10n } = React.useContext(LocalizationContext);
    const isDarkTheme = theme.currentTheme === 'dark';

    const label =
        l10n && l10n.theme
            ? isDarkTheme
                ? l10n.theme.switchLightTheme
                : l10n.theme.switchDarkTheme
            : isDarkTheme
            ? 'Switch to the light theme'
            : 'Switch to the dark theme';

    return (
        <Tooltip
            ariaControlsSuffix="theme-switch"
            position={Position.BottomCenter}
            target={
                <MinimalButton ariaLabel={label as string} testId="theme__switch-button" onClick={onClick}>
                    {isDarkTheme ? <LightIcon /> : <DarkIcon />}
                </MinimalButton>
            }
            content={() => label}
            offset={TOOLTIP_OFFSET}
        />
    );
};
