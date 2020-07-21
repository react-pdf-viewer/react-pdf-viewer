/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { Component, ReactElement } from 'react';
import { Plugin } from '@phuocng/rpv';

export interface RenderZoomInButtonProps {
    onClick: () => void;
}

export type RenderZoomInButton = (props: RenderZoomInButtonProps) => ReactElement;

export interface ZoomInButtonProps {
    children?: RenderZoomInButton;
}

export interface ZoomPlugin extends Plugin {
    ZoomInButton: (props: ZoomInButtonProps) => ReactElement;
    ZoomInButton: () => ReactElement;
}

export default function zoomPlugin(): ZoomPlugin;
export class ZoomInIcon extends Component<{}> {}
