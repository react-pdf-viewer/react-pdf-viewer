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

export interface RenderZoomOutButtonProps {
    onClick: () => void;
}

export type RenderZoomOutButton = (props: RenderZoomOutButtonProps) => ReactElement;

export interface ZoomOutButtonProps {
    children?: RenderZoomOutButton;
}

export interface ZoomPlugin extends Plugin {
    ZoomIn: (props: ZoomInButtonProps) => ReactElement;
    ZoomInButton: () => ReactElement;
    ZoomOut: (props: ZoomOutButtonProps) => ReactElement;
    ZoomOutButton: () => ReactElement;
}

export default function zoomPlugin(): ZoomPlugin;
export class ZoomInIcon extends Component<{}> {}
export class ZoomOutIcon extends Component<{}> {}
