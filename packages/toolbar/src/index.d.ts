/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { Component, ReactElement } from 'react';
import { Plugin } from '@react-pdf-viewer/core';
import { EnterFullScreenProps } from '@react-pdf-viewer/full-screen';
import { DownloadProps, GetFilePluginProps } from '@react-pdf-viewer/get-file';
import { OpenProps } from '@react-pdf-viewer/open';
import { CurrentPageLabelProps, GoToFirstPageProps, GoToFirstPageMenuItemProps, GoToLastPageProps, GoToLastPageMenuItemProps, GoToNextPageProps, GoToPreviousPageProps } from '@react-pdf-viewer/page-navigation';
import { PrintProps } from '@react-pdf-viewer/print';
import { ShowPropertiesProps, ShowPropertiesMenuItemProps } from '@react-pdf-viewer/properties';
import { RotateDecoratorProps, RotateProps } from '@react-pdf-viewer/rotate';
import { ScrollModePluginProps, SwitchScrollModeMenuItemProps, SwitchScrollModeProps } from '@react-pdf-viewer/scroll-mode';
import { SearchPluginProps, SearchProps, ShowSearchPopoverProps } from '@react-pdf-viewer/search';
import { SelectionModePluginProps, SwitchSelectionModeMenuItemProps, SwitchSelectionModeProps } from '@react-pdf-viewer/selection-mode';
import { CurrentScaleProps, ZoomProps, ZoomInProps, ZoomOutProps } from '@react-pdf-viewer/zoom';

export interface ToolbarSlot {
    CurrentPageInput(): ReactElement;
    CurrentPageLabel(props: CurrentPageLabelProps): ReactElement;
    CurrentScale(props: CurrentScaleProps): ReactElement;
    Download(props: DownloadProps): ReactElement;
    EnterFullScreen(props: EnterFullScreenProps): ReactElement;
    GoToFirstPage(props: GoToFirstPageProps): ReactElement;
    GoToFirstPageMenuItem(props: GoToFirstPageMenuItemProps): ReactElement;
    GoToLastPage(props: GoToLastPageProps): ReactElement;
    GoToLastPageMenuItem(props: GoToLastPageMenuItemProps): ReactElement;
    GoToNextPage(props: GoToNextPageProps): ReactElement;
    GoToPreviousPage(props: GoToPreviousPageProps): ReactElement;
    NumberOfPages(): ReactElement;
    Open(props: OpenProps): ReactElement;
    Print(props: PrintProps): ReactElement;
    Rotate(props: RotateProps): ReactElement;
    RotateBackwardMenuItem(props: RotateDecoratorProps): ReactElement;
    RotateForwardMenuItem(props: RotateDecoratorProps): ReactElement;
    Search(props: SearchProps): ReactElement;
    ShowProperties(props: ShowPropertiesProps): ReactElement;
    ShowPropertiesMenuItem(props: ShowPropertiesMenuItemProps): ReactElement;
    ShowSearchPopover(props: ShowSearchPopoverProps): ReactElement;
    SwitchScrollMode(props: SwitchScrollModeProps): ReactElement;
    SwitchScrollModeMenuItem(props: SwitchScrollModeMenuItemProps): ReactElement;
    SwitchSelectionMode(props: SwitchSelectionModeProps): ReactElement;
    SwitchSelectionModeMenuItem(props: SwitchSelectionModeMenuItemProps): ReactElement;
    Zoom(props: ZoomProps): ReactElement;
    ZoomIn(props: ZoomInProps): ReactElement;
    ZoomOut(props: ZoomOutProps): ReactElement;
}

export interface ToolbarProps {
    children?: (toolbarSlot: ToolbarSlot) => ReactElement;
}

export interface ToolbarPlugin extends Plugin {
    Toolbar: (props: ToolbarProps) => ReactElement;
}

export interface ToolbarPluginProps {
    getFilePlugin?: GetFilePluginProps;
    scrollModePlugin?: ScrollModePluginProps;
    searchPlugin?: SearchPluginProps;
    selectionModePlugin?: SelectionModePluginProps;
}

export function toolbarPlugin(props?: ToolbarPluginProps): ToolbarPlugin;

export interface MoreActionsPopoverProps {
    toolbarSlot: ToolbarSlot;
}
export class MoreActionsPopover extends Component<MoreActionsPopoverProps> {}

// ----
// Icon
// ----

export class MoreIcon extends Component {}

