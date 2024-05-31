/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { type Plugin } from '@react-pdf-viewer/core';
import * as React from 'react';

// Types
export interface SwitchThemeProps {
    children?: (props: RenderSwitchThemeProps) => React.ReactElement;
}

export interface SwitchThemeMenuItemProps {
    onClick(): void;
}

export interface RenderSwitchThemeProps {
    onClick(): void;
}

// Plugin
export interface ThemePlugin extends Plugin {
    SwitchTheme: (props: SwitchThemeProps) => React.ReactElement;
    SwitchThemeButton: () => React.ReactElement;
    SwitchThemeMenuItem: (props: SwitchThemeMenuItemProps) => React.ReactElement;
}

export function themePlugin(): ThemePlugin;

// Components
export class DarkIcon extends React.Component {}
export class LightIcon extends React.Component {}
