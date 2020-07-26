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
    mode: ScrollMode;
    onClick(): void;
}

export type RenderSwitchScrollMode = (props: RenderSwitchScrollModeProps) => ReactElement;

export interface SwitchScrollModeProps {
    children?: RenderSwitchScrollMode;
    mode: ScrollMode;
}

export interface ScrollModePlugin extends Plugin {
    SwitchScrollMode(props: SwitchScrollModeProps): ReactElement;
    SwitchScrollModeMenuItem(props: RenderSwitchScrollModeProps): ReactElement;
}

export default function scrollModePlugin(): ScrollModePlugin;

// -----
// Icons
// -----

export class HorizontalScrollingIcon extends Component<{}> {}
export class VerticalScrollingIcon extends Component<{}> {}
export class WrappedScrollingIcon extends Component<{}> {}
