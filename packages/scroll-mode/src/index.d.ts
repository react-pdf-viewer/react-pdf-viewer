/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { ScrollMode } from '@react-pdf-viewer/core';
import type { Plugin } from '@react-pdf-viewer/core';

// Types
export interface SwitchScrollModeProps {
    children?: (props: RenderSwitchScrollModeProps) => React.ReactElement;
    mode: ScrollMode;
}

export interface RenderSwitchScrollModeProps {
    isSelected: boolean;
    mode: ScrollMode;
    onClick(): void;
}

export interface SwitchScrollModeButtonProps {
    mode: ScrollMode;
}

export interface SwitchScrollModeMenuItemProps {
    mode: ScrollMode;
    onClick(): void;
}

// Plugin
export interface ScrollModePlugin extends Plugin {
    switchScrollMode(mode: ScrollMode): void;
    SwitchScrollMode(props: SwitchScrollModeProps): React.ReactElement;
    SwitchScrollModeButton(props: SwitchScrollModeButtonProps): React.ReactElement;
    SwitchScrollModeMenuItem(props: SwitchScrollModeMenuItemProps): React.ReactElement;
}

export function scrollModePlugin(): ScrollModePlugin;

// Components
export class HorizontalScrollingIcon extends React.Component {}
export class VerticalScrollingIcon extends React.Component {}
export class WrappedScrollingIcon extends React.Component {}
