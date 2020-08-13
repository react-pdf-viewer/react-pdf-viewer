/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { Component, ReactElement } from 'react';
import { Plugin } from '@phuocng/rpv';

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

export interface SwitchScrollModeMenuItemProps {
    mode: ScrollMode;
    onClick(): void;
}

export interface ScrollModePlugin extends Plugin {
    SwitchScrollMode(props: SwitchScrollModeProps): ReactElement;
    SwitchScrollModeMenuItem(props: SwitchScrollModeMenuItemProps): ReactElement;
}

export default function scrollModePlugin(): ScrollModePlugin;

// -----
// Icons
// -----

export class HorizontalScrollingIcon extends Component {}
export class VerticalScrollingIcon extends Component {}
export class WrappedScrollingIcon extends Component {}
