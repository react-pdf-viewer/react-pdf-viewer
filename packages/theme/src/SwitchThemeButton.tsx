/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import {
    LocalizationContext,
    MinimalButton,
    Position,
    ThemeContext,
    Tooltip,
    type LocalizationMap,
} from '@react-pdf-viewer/core';
import * as React from 'react';
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
                ? ((l10n.theme as LocalizationMap).switchLightTheme as string)
                : ((l10n.theme as LocalizationMap).switchDarkTheme as string)
            : isDarkTheme
            ? 'Switch to the light theme'
            : 'Switch to the dark theme';

    return (
        <Tooltip
            ariaControlsSuffix="theme-switch"
            position={Position.BottomCenter}
            target={
                <MinimalButton ariaLabel={label} testId="theme__switch-button" onClick={onClick}>
                    {isDarkTheme ? <LightIcon /> : <DarkIcon />}
                </MinimalButton>
            }
            content={() => label}
            offset={TOOLTIP_OFFSET}
        />
    );
};
