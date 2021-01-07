/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Plugin } from '@react-pdf-viewer/core';
import { EnterFullScreenProps } from '@react-pdf-viewer/full-screen';
import { DownloadProps, GetFilePluginProps } from '@react-pdf-viewer/get-file';
import { OpenProps } from '@react-pdf-viewer/open';
import {
    CurrentPageLabelProps,
    GoToFirstPageProps,
    GoToFirstPageMenuItemProps,
    GoToLastPageProps,
    GoToLastPageMenuItemProps,
    GoToNextPageProps,
    GoToPreviousPageProps,
} from '@react-pdf-viewer/page-navigation';
import { PrintProps } from '@react-pdf-viewer/print';
import {
    ShowPropertiesProps,
    ShowPropertiesMenuItemProps,
} from '@react-pdf-viewer/properties';
import { RotateDecoratorProps, RotateProps } from '@react-pdf-viewer/rotate';
import {
    ScrollModePluginProps,
    SwitchScrollModeMenuItemProps,
    SwitchScrollModeProps,
} from '@react-pdf-viewer/scroll-mode';
import {
    SearchPluginProps,
    SearchProps,
    ShowSearchPopoverProps,
} from '@react-pdf-viewer/search';
import {
    SelectionModePluginProps,
    SwitchSelectionModeMenuItemProps,
    SwitchSelectionModeProps,
} from '@react-pdf-viewer/selection-mode';
import {
    CurrentScaleProps,
    ZoomProps,
    ZoomInProps,
    ZoomOutProps,
} from '@react-pdf-viewer/zoom';

export interface ToolbarSlot {
    CurrentPageInput(): React.ReactElement;
    CurrentPageLabel(props: CurrentPageLabelProps): React.ReactElement;
    CurrentScale(props: CurrentScaleProps): React.ReactElement;
    Download(props: DownloadProps): React.ReactElement;
    EnterFullScreen(props: EnterFullScreenProps): React.ReactElement;
    GoToFirstPage(props: GoToFirstPageProps): React.ReactElement;
    GoToFirstPageMenuItem(
        props: GoToFirstPageMenuItemProps
    ): React.ReactElement;
    GoToLastPage(props: GoToLastPageProps): React.ReactElement;
    GoToLastPageMenuItem(props: GoToLastPageMenuItemProps): React.ReactElement;
    GoToNextPage(props: GoToNextPageProps): React.ReactElement;
    GoToPreviousPage(props: GoToPreviousPageProps): React.ReactElement;
    NumberOfPages(): React.ReactElement;
    Open(props: OpenProps): React.ReactElement;
    Print(props: PrintProps): React.ReactElement;
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

export class MoreIcon extends React.Component {}
