/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import type { Plugin, ViewerProps } from '@react-pdf-viewer/core/lib';
import type { AttachmentPlugin } from '@react-pdf-viewer/attachment/lib';
import type { BookmarkPlugin } from '@react-pdf-viewer/bookmark/lib';
import type { ThumbnailPlugin } from '@react-pdf-viewer/thumbnail/lib';
import type { ToolbarPlugin, ToolbarPluginProps, ToolbarProps, ToolbarSlot } from '@react-pdf-viewer/toolbar/lib';

export type { ToolbarPluginProps, ToolbarProps, ToolbarSlot };

export interface SidebarTab {
    content: React.ReactElement;
    icon: React.ReactElement;
    title: string;
}

export interface DefaultLayoutPlugin extends Plugin {
    activateTab(index: number): void;
    attachmentPluginInstance: AttachmentPlugin;
    bookmarkPluginInstance: BookmarkPlugin;
    thumbnailPluginInstance: ThumbnailPlugin;
    toolbarPluginInstance: ToolbarPlugin;
}

export interface DefaultLayoutProps extends ViewerProps {
    toolbarPlugin?: ToolbarPluginProps;
}

export interface DefaultLayoutPluginProps {
    toolbarPlugin?: ToolbarPluginProps;
    renderToolbar?: (Toolbar: (props: ToolbarProps) => React.ReactElement) => React.ReactElement;
    sidebarTabs?: (defaultTabs: SidebarTab[]) => SidebarTab[];
}

export function defaultLayoutPlugin(props?: DefaultLayoutPluginProps): DefaultLayoutPlugin;

// -----
// Icons
// -----

export class BookmarkIcon extends React.Component {}
export class FileIcon extends React.Component {}
export class ThumbnailIcon extends React.Component {}
