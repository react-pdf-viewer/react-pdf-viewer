/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { Component, ReactElement, ReactNode } from 'react';
import { Plugin, SpecialZoomLevel } from '@react-pdf-viewer/core';

// ------------------------
// Render zooming in button
// ------------------------

export interface RenderZoomInProps {
    onClick: () => void;
}

export interface ZoomInProps {
    children?: (props: RenderZoomInProps) => ReactElement;
}

// -------------------------
// Render zooming out button
// -------------------------

export interface RenderZoomOutProps {
    onClick: () => void;
}

export interface ZoomOutProps {
    children?: (props: RenderZoomOutProps) => ReactNode;
}

// -------------
// Current scale
// -------------

export interface RenderCurrentScaleProps {
    scale: number;
}

export interface CurrentScaleProps {
    children?: (props: RenderCurrentScaleProps) => ReactElement;
}

// -------------------
// Zoom to given scale
// -------------------

export interface RenderZoomProps {
    scale: number;
    onZoom(newScale: number | SpecialZoomLevel): void;
}

export interface ZoomProps {
    children?: (props: RenderZoomProps) => ReactElement;
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
    Zoom: (props: ZoomProps) => ReactElement;
    ZoomPopover: () => ReactElement;
}

export function zoomPlugin(): ZoomPlugin;
export class ZoomInIcon extends Component {}
export class ZoomOutIcon extends Component {}
