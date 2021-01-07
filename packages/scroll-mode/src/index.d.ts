/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
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
    children?: (props: RenderSwitchScrollModeProps) => React.ReactElement;
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
    SwitchScrollMode(props: SwitchScrollModeProps): React.ReactElement;
    SwitchScrollModeButton(
        props: SwitchScrollModeButtonProps
    ): React.ReactElement;
    SwitchScrollModeMenuItem(
        props: SwitchScrollModeMenuItemProps
    ): React.ReactElement;
}

export interface ScrollModePluginProps {
    scrollMode?: ScrollMode;
}

export function scrollModePlugin(
    props?: ScrollModePluginProps
): ScrollModePlugin;

// -----
// Icons
// -----

export class HorizontalScrollingIcon extends React.Component {}
export class VerticalScrollingIcon extends React.Component {}
export class WrappedScrollingIcon extends React.Component {}
