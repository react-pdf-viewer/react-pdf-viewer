/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { Component, ReactElement } from 'react';
import { Plugin } from '@react-pdf-viewer/core';

export enum ScrollMode {
    Horizontal = 'Horizontal',
    Vertical = 'Vertical',
    Wrapped = 'Wrapped',
}

export interface RenderSwitchScrollModeProps {
    isSelected: boolean;
    mode: ScrollMode;
    onClick(): void;
}

export interface SwitchScrollModeProps {
    children?: (props: RenderSwitchScrollModeProps) => ReactElement;
    mode: ScrollMode;
}

export interface SwitchScrollModeButtonProps {
    mode: ScrollMode;
}

export interface SwitchScrollModeMenuItemProps {
    mode: ScrollMode;
    onClick(): void;
}

export interface ScrollModePlugin extends Plugin {
    SwitchScrollMode(props: SwitchScrollModeProps): ReactElement;
    SwitchScrollModeButton(props: SwitchScrollModeButtonProps): ReactElement;
    SwitchScrollModeMenuItem(props: SwitchScrollModeMenuItemProps): ReactElement;
}

export interface ScrollModePluginProps {
    scrollMode?: ScrollMode;
}

export function scrollModePlugin(props?: ScrollModePluginProps): ScrollModePlugin;

// -----
// Icons
// -----

export class HorizontalScrollingIcon extends Component {}
export class VerticalScrollingIcon extends Component {}
export class WrappedScrollingIcon extends Component {}
