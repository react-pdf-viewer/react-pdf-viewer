/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { type AttachmentPlugin } from '@react-pdf-viewer/attachment';
import { type BookmarkPlugin } from '@react-pdf-viewer/bookmark';
import { type PdfJs, type Plugin } from '@react-pdf-viewer/core';
import { type ThumbnailPlugin, type ThumbnailPluginProps } from '@react-pdf-viewer/thumbnail';
import {
    type ToolbarPlugin,
    type ToolbarPluginProps,
    type ToolbarProps,
    type ToolbarSlot,
} from '@react-pdf-viewer/toolbar';
import * as React from 'react';

// Types
export { type ToolbarPluginProps, type ToolbarProps, type ToolbarSlot };

export interface SidebarTab {
    content: React.ReactElement;
    icon: React.ReactElement;
    title: string;
}

// Plugin
export interface DefaultLayoutPlugin extends Plugin {
    activateTab(index: number): void;
    toggleTab(index: number): void;
    readonly attachmentPluginInstance: AttachmentPlugin;
    readonly bookmarkPluginInstance: BookmarkPlugin;
    readonly thumbnailPluginInstance: ThumbnailPlugin;
    readonly toolbarPluginInstance: ToolbarPlugin;
}

export interface DefaultLayoutPluginProps {
    thumbnailPlugin?: ThumbnailPluginProps;
    toolbarPlugin?: ToolbarPluginProps;
    renderToolbar?: (Toolbar: (props: ToolbarProps) => React.ReactElement) => React.ReactElement;
    setInitialTab?: (doc: PdfJs.PdfDocument) => Promise<number>;
    sidebarTabs?: (defaultTabs: SidebarTab[]) => SidebarTab[];
}

export function defaultLayoutPlugin(props?: DefaultLayoutPluginProps): DefaultLayoutPlugin;
export function setInitialTabFromPageMode(doc: PdfJs.PdfDocument): Promise<number>;

// Components
export class BookmarkIcon extends React.Component {}
export class FileIcon extends React.Component {}
export class ThumbnailIcon extends React.Component {}
