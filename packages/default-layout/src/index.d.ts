/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { Component } from 'react';
import { Plugin, ViewerProps } from '@react-pdf-viewer/core';
import type { ToolbarPluginProps } from '@react-pdf-viewer/toolbar';

export interface DefaultLayoutProps extends ViewerProps {
    toolbarPlugin?: ToolbarPluginProps;
}

export interface DefaultLayoutPluginProps {
    toolbarPlugin?: ToolbarPluginProps;
}

export function defaultLayoutPlugin(props?: DefaultLayoutPluginProps): Plugin;

// -----
// Icons
// -----

export class BookmarkIcon extends Component {}
export class FileIcon extends Component {}
export class ThumbnailIcon extends Component {}
