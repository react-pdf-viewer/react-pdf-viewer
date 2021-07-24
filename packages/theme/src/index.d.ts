/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import type { Plugin } from '@react-pdf-viewer/core';

export interface SwitchThemeMenuItemProps {
    onClick(): void;
}

export interface RenderSwitchThemeProps {
    onClick(): void;
}

export interface SwitchThemeProps {
    children?: (props: RenderSwitchThemeProps) => React.ReactElement;
}

export interface ThemePlugin extends Plugin {
    SwitchTheme: (props: SwitchThemeProps) => React.ReactElement;
    SwitchThemeButton: () => React.ReactElement;
    SwitchThemeMenuItem: (props: SwitchThemeMenuItemProps) => React.ReactElement;
}

export function themePlugin(): ThemePlugin;

export class DarkIcon extends React.Component {}
export class LightIcon extends React.Component {}
