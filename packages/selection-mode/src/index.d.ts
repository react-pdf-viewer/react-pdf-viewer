/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Plugin } from '@react-pdf-viewer/core';

export enum SelectionMode {
    Hand = 'Hand',
    Text = 'Text',
}

export interface RenderSwitchSelectionModeProps {
    isSelected: boolean;
    mode: SelectionMode;
    onClick(): void;
}

export interface SwitchSelectionModeProps {
    children?: (props: RenderSwitchSelectionModeProps) => React.ReactElement;
    mode: SelectionMode;
}

export interface SwitchSelectionModeButtonProps {
    mode: SelectionMode;
}

export interface SwitchSelectionModeMenuItemProps {
    mode: SelectionMode;
    onClick(): void;
}

export interface SelectionModePlugin extends Plugin {
    SwitchSelectionMode(props: SwitchSelectionModeProps): React.ReactElement;
    SwitchSelectionModeButton(
        props: SwitchSelectionModeButtonProps
    ): React.ReactElement;
    SwitchSelectionModeMenuItem(
        props: SwitchSelectionModeMenuItemProps
    ): React.ReactElement;
}

export interface SelectionModePluginProps {
    selectionMode?: SelectionMode;
}

export function selectionModePlugin(
    props?: SelectionModePluginProps
): SelectionModePlugin;

// -----
// Icons
// -----

export class HandToolIcon extends React.Component {}
export class TextSelectionIcon extends React.Component {}
