/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
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
    children?: (props: RenderRotateProps) => React.ReactElement;
    direction: RotateDirection;
}

// ------
// Plugin
// ------

export interface RotatePlugin extends Plugin {
    Rotate(props: RotateProps): React.ReactElement;
    RotateBackwardButton(): React.ReactElement;
    RotateBackwardMenuItem(props: RotateDecoratorProps): React.ReactElement;
    RotateForwardButton(): React.ReactElement;
    RotateForwardMenuItem(props: RotateDecoratorProps): React.ReactElement;
}

export function rotatePlugin(): RotatePlugin;

// -----
// Icons
// -----

export class RotateBackwardIcon extends React.Component {}
export class RotateForwardIcon extends React.Component {}
