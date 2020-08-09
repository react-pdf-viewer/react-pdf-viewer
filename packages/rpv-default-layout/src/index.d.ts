/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { Component } from 'react';
import { Plugin } from '@phuocng/rpv';
import type { ToolbarPluginProps } from '@phuocng/rpv-toolbar';

export interface DefaultLayoutPluginProps {
    toolbarPlugin?: ToolbarPluginProps;
}

export default function defaultLayoutPlugin(props?: DefaultLayoutPluginProps): Plugin;

// -----
// Icons
// -----

export class BookmarkIcon extends Component<{}> {}
export class FileIcon extends Component<{}> {}
export class ThumbnailIcon extends Component<{}> {}
