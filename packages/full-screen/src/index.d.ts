/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { Component, ReactElement } from 'react';
import { Plugin } from '@react-pdf-viewer/core';

export interface RenderEnterFullScreenProps {
    onClick(): void;
}

export interface EnterFullScreenProps {
    children?(props: RenderEnterFullScreenProps): ReactElement;
}

export interface FullScreenPlugin extends Plugin {
    EnterFullScreen(props: EnterFullScreenProps): ReactElement;
    EnterFullScreenButton(): ReactElement;
}

export default function fullScreenPlugin(): FullScreenPlugin;

export class ExitFullScreenIcon extends Component {}
export class FullScreenIcon extends Component {}
