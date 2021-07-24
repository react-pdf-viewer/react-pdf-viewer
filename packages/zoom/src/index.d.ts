/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { SpecialZoomLevel } from '@react-pdf-viewer/core';
import type { Plugin } from '@react-pdf-viewer/core/lib';

export interface ZoomMenuItemProps {
    onClick: () => void;
}

// ------------------------
// Render zooming in button
// ------------------------

export interface RenderZoomInProps {
    enableShortcuts: boolean;
    onClick: () => void;
}

export interface ZoomInProps {
    children?: (props: RenderZoomInProps) => React.ReactElement;
}

// -------------------------
// Render zooming out button
// -------------------------

export interface RenderZoomOutProps {
    enableShortcuts: boolean;
    onClick: () => void;
}

export interface ZoomOutProps {
    children?: (props: RenderZoomOutProps) => React.ReactNode;
}

// -------------
// Current scale
// -------------

export interface RenderCurrentScaleProps {
    scale: number;
}

export interface CurrentScaleProps {
    children?: (props: RenderCurrentScaleProps) => React.ReactElement;
}

// -------------------
// Zoom to given scale
// -------------------

export interface RenderZoomProps {
    scale: number;
    onZoom(newScale: number | SpecialZoomLevel): void;
}

export interface ZoomProps {
    children?: (props: RenderZoomProps) => React.ReactElement;
}

// ------
// Plugin
// ------

export interface ZoomPluginProps {
    enableShortcuts?: boolean;
}

export interface ZoomPlugin extends Plugin {
    zoomTo: (scale: number | SpecialZoomLevel) => void;
    CurrentScale: (props: CurrentScaleProps) => React.ReactElement;
    ZoomIn: (props: ZoomInProps) => React.ReactElement;
    ZoomInButton: () => React.ReactElement;
    ZoomInMenuItem: (props: ZoomMenuItemProps) => React.ReactElement;
    ZoomOut: (props: ZoomOutProps) => React.ReactElement;
    ZoomOutButton: () => React.ReactElement;
    ZoomOutMenuItem: (props: ZoomMenuItemProps) => React.ReactElement;
    Zoom: (props: ZoomProps) => React.ReactElement;
    ZoomPopover: () => React.ReactElement;
}

export function zoomPlugin(props?: ZoomPluginProps): ZoomPlugin;
export class ZoomInIcon extends React.Component {}
export class ZoomOutIcon extends React.Component {}
