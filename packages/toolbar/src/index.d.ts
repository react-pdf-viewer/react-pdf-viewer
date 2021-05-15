/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import type { Plugin } from '@react-pdf-viewer/core';
import type {
    EnterFullScreenMenuItemProps,
    EnterFullScreenProps,
    FullScreenPlugin,
    FullScreenPluginProps,
} from '@react-pdf-viewer/full-screen';
import type {
    DownloadMenuItemProps,
    DownloadProps,
    GetFilePlugin,
    GetFilePluginProps,
} from '@react-pdf-viewer/get-file';
import type { OpenPlugin, OpenProps } from '@react-pdf-viewer/open';
import type {
    CurrentPageLabelProps,
    GoToFirstPageProps,
    GoToFirstPageMenuItemProps,
    GoToLastPageProps,
    GoToLastPageMenuItemProps,
    GoToNextPageProps,
    GoToPreviousPageProps,
    PageNavigationPlugin,
    RenderGoToNextPageProps,
    RenderGoToPreviousPageProps,
} from '@react-pdf-viewer/page-navigation';
import type {
    PrintMenuItemProps,
    PrintPlugin,
    PrintProps,
} from '@react-pdf-viewer/print';
import type {
    PropertiesPlugin,
    ShowPropertiesProps,
    ShowPropertiesMenuItemProps,
} from '@react-pdf-viewer/properties';
import type {
    RotateDecoratorProps,
    RotatePlugin,
    RotateProps,
} from '@react-pdf-viewer/rotate';
import type {
    ScrollModePlugin,
    ScrollModePluginProps,
    SwitchScrollModeMenuItemProps,
    SwitchScrollModeProps,
} from '@react-pdf-viewer/scroll-mode';
import type {
    SearchPlugin,
    SearchPluginProps,
    SearchProps,
    ShowSearchPopoverProps,
} from '@react-pdf-viewer/search';
import type {
    SelectionModePlugin,
    SelectionModePluginProps,
    SwitchSelectionModeMenuItemProps,
    SwitchSelectionModeProps,
} from '@react-pdf-viewer/selection-mode';
import type {
    CurrentScaleProps,
    ZoomInProps,
    ZoomOutProps,
    ZoomPlugin,
    ZoomProps,
} from '@react-pdf-viewer/zoom';

export interface ToolbarSlot {
    CurrentPageInput(): React.ReactElement;
    CurrentPageLabel(props: CurrentPageLabelProps): React.ReactElement;
    CurrentScale(props: CurrentScaleProps): React.ReactElement;
    Download(props: DownloadProps): React.ReactElement;
    DownloadMenuItem(props: DownloadMenuItemProps): React.ReactElement;
    EnterFullScreen(props: EnterFullScreenProps): React.ReactElement;
    EnterFullScreenMenuItem(
        props: EnterFullScreenMenuItemProps
    ): React.ReactElement;
    GoToFirstPage(props: GoToFirstPageProps): React.ReactElement;
    GoToFirstPageMenuItem(
        props: GoToFirstPageMenuItemProps
    ): React.ReactElement;
    GoToLastPage(props: GoToLastPageProps): React.ReactElement;
    GoToLastPageMenuItem(props: GoToLastPageMenuItemProps): React.ReactElement;
    GoToNextPage(props: GoToNextPageProps): React.ReactElement;
    GoToNextPageMenuItem(props: RenderGoToNextPageProps): React.ReactElement;
    GoToPreviousPage(props: GoToPreviousPageProps): React.ReactElement;
    GoToPreviousPageMenuItem(props: RenderGoToPreviousPageProps): React.ReactElement;
    NumberOfPages(): React.ReactElement;
    Open(props: OpenProps): React.ReactElement;
    OpenMenuItem(): React.ReactElement;
    Print(props: PrintProps): React.ReactElement;
    PrintMenuItem(props: PrintMenuItemProps): React.ReactElement;
    Rotate(props: RotateProps): React.ReactElement;
    RotateBackwardMenuItem(props: RotateDecoratorProps): React.ReactElement;
    RotateForwardMenuItem(props: RotateDecoratorProps): React.ReactElement;
    Search(props: SearchProps): React.ReactElement;
    ShowProperties(props: ShowPropertiesProps): React.ReactElement;
    ShowPropertiesMenuItem(
        props: ShowPropertiesMenuItemProps
    ): React.ReactElement;
    ShowSearchPopover(props: ShowSearchPopoverProps): React.ReactElement;
    SwitchScrollMode(props: SwitchScrollModeProps): React.ReactElement;
    SwitchScrollModeMenuItem(
        props: SwitchScrollModeMenuItemProps
    ): React.ReactElement;
    SwitchSelectionMode(props: SwitchSelectionModeProps): React.ReactElement;
    SwitchSelectionModeMenuItem(
        props: SwitchSelectionModeMenuItemProps
    ): React.ReactElement;
    Zoom(props: ZoomProps): React.ReactElement;
    ZoomIn(props: ZoomInProps): React.ReactElement;
    ZoomOut(props: ZoomOutProps): React.ReactElement;
}

export interface ToolbarProps {
    children?: (toolbarSlot: ToolbarSlot) => React.ReactElement;
}

export interface ToolbarPlugin extends Plugin {
    Toolbar: (props: ToolbarProps) => React.ReactElement;
    // Plugins instance
    dropPluginInstance: Plugin;
    fullScreenPluginInstance: FullScreenPlugin;
    getFilePluginInstance: GetFilePlugin;
    openPluginInstance: OpenPlugin;
    pageNavigationPluginInstance: PageNavigationPlugin;
    printPluginInstance: PrintPlugin;
    propertiesPluginInstance: PropertiesPlugin;
    rotatePluginInstance: RotatePlugin;
    scrollModePluginInstance: ScrollModePlugin;
    searchPluginInstance: SearchPlugin;
    selectionModePluginInstance: SelectionModePlugin;
    zoomPluginInstance: ZoomPlugin;
}

export interface ToolbarPluginProps {
    fullScreenPlugin?: FullScreenPluginProps;
    getFilePlugin?: GetFilePluginProps;
    scrollModePlugin?: ScrollModePluginProps;
    searchPlugin?: SearchPluginProps;
    selectionModePlugin?: SelectionModePluginProps;
}

export function toolbarPlugin(props?: ToolbarPluginProps): ToolbarPlugin;

export interface MoreActionsPopoverProps {
    toolbarSlot: ToolbarSlot;
}
export class MoreActionsPopover extends React.Component<MoreActionsPopoverProps> {}

// ----
// Icon
// ----

export class MoreIcon extends React.Component {}
