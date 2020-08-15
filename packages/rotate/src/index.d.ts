/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { Component, ReactElement } from 'react';
import { Plugin } from '@react-pdf-viewer/core';

export enum RotateDirection {
    Backward = 'Backward',
    Forward = 'Forward',
}

export interface RenderRotateProps {
    direction: RotateDirection;
    onClick(): void;
}

export interface RotateDecoratorProps {
    onClick(): void;
}

export interface RotateProps {
    children?: (props: RenderRotateProps) => ReactElement;
    direction: RotateDirection;
}

// ------
// Plugin
// ------

export interface RotatePlugin extends Plugin {
    Rotate(props: RotateProps): ReactElement;
    RotateBackwardButton(): ReactElement;
    RotateBackwardMenuItem(props: RotateDecoratorProps): ReactElement;
    RotateForwardButton(): ReactElement;
    RotateForwardMenuItem(props: RotateDecoratorProps): ReactElement;
}

export default function rotatePlugin(): RotatePlugin;

// -----
// Icons
// -----

export class RotateBackwardIcon extends Component {}
export class RotateForwardIcon extends Component {}
