/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { Component } from 'react';
import type { ViewerProps } from '@phuocng/rpv';
import type { ToolbarPluginProps } from '@phuocng/rpv-toolbar';

export interface DefaultLayoutProps extends ViewerProps {
    toolbarPlugin?: ToolbarPluginProps;
}

export default class DefaultLayout extends Component<DefaultLayoutProps> {}

// -----
// Icons
// -----

export class BookmarkIcon extends Component {}
export class FileIcon extends Component {}
export class ThumbnailIcon extends Component {}
