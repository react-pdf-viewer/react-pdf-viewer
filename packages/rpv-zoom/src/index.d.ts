/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { Component, ReactElement, ReactNode } from 'react';
import { Plugin } from '@phuocng/rpv';

// ------------------------
// Render zooming in button
// ------------------------

export interface RenderZoomInProps {
    onClick: () => void;
}

export type RenderZoomIn = (props: RenderZoomInProps) => ReactElement;

export interface ZoomInProps {
    children?: RenderZoomIn;
}

// -------------------------
// Render zooming out button
// -------------------------

export interface RenderZoomOutProps {
    onClick: () => void;
}

export type RenderZoomOut = (props: RenderZoomOutProps) => ReactNode;

export interface ZoomOutProps {
    children?: RenderZoomOut;
}

// -------------
// Current scale
// -------------

export interface RenderCurrentScaleProps {
    scale: number;
}

export type RenderCurrentScale = (props: RenderCurrentScaleProps) => ReactElement;

export interface CurrentScaleProps {
    children?: RenderCurrentScale;
}

// ------
// Plugin
// ------

export interface ZoomPlugin extends Plugin {
    CurrentScale: (props: CurrentScaleProps) => ReactElement;
    ZoomIn: (props: ZoomInProps) => ReactElement;
    ZoomInButton: () => ReactElement;
    ZoomOut: (props: ZoomOutProps) => ReactElement;
    ZoomOutButton: () => ReactElement;
    ZoomPopover: () => ReactElement;
}

export default function zoomPlugin(): ZoomPlugin;
export class ZoomInIcon extends Component<{}> {}
export class ZoomOutIcon extends Component<{}> {}
