/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { Component, ReactElement } from 'react';
import { Plugin } from '@phuocng/rpv';

// ------------------------
// Render zooming in button
// ------------------------

export interface RenderZoomInButtonProps {
    onClick: () => void;
}

export type RenderZoomInButton = (props: RenderZoomInButtonProps) => ReactElement;

export interface ZoomInButtonProps {
    children?: RenderZoomInButton;
}

// -------------------------
// Render zooming out button
// -------------------------

export interface RenderZoomOutButtonProps {
    onClick: () => void;
}

export type RenderZoomOutButton = (props: RenderZoomOutButtonProps) => ReactElement;

export interface ZoomOutButtonProps {
    children?: RenderZoomOutButton;
}

// -------------
// Current scale
// -------------

export interface RenderCurrentScaleProps {
    scale: number;
}

export interface CurrentScaleProps {
    children?: RenderCurrentScale;
}

export type RenderCurrentScale = (props: RenderCurrentScaleProps) => ReactElement;

// ------
// Plugin
// ------

export interface ZoomPlugin extends Plugin {
    CurrentScale: (props: CurrentScaleProps) => ReactElement;
    ZoomIn: (props: ZoomInButtonProps) => ReactElement;
    ZoomInButton: () => ReactElement;
    ZoomOut: (props: ZoomOutButtonProps) => ReactElement;
    ZoomOutButton: () => ReactElement;
    ZoomPopover: () => ReactElement;
}

export default function zoomPlugin(): ZoomPlugin;
export class ZoomInIcon extends Component<{}> {}
export class ZoomOutIcon extends Component<{}> {}
