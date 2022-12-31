/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { LocalizationMap } from '@react-pdf-viewer/core';
import { LocalizationContext, MenuItem, ThemeContext } from '@react-pdf-viewer/core';
import * as React from 'react';
import { DarkIcon } from './DarkIcon';
import { LightIcon } from './LightIcon';

export interface SwitchThemeMenuItemProps {
    onClick(): void;
}

export const SwitchThemeMenuItem: React.FC<SwitchThemeMenuItemProps> = ({ onClick }) => {
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
        <MenuItem icon={isDarkTheme ? <LightIcon /> : <DarkIcon />} testId="theme__switch-menu" onClick={onClick}>
            {label}
        </MenuItem>
    );
};
