/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { ReactElement } from 'react';
import { Plugin } from '@phuocng/rpv';
import { DownloadProps } from '@phuocng/rpv-download';
import { EnterFullScreenProps } from '@phuocng/rpv-full-screen';
import { OpenProps } from '@phuocng/rpv-open';
import { CurrentPageLabelProps, GoToFirstPageProps, GoToFirstPageMenuItemProps, GoToLastPageProps, GoToLastPageMenuItemProps, GoToNextPageProps, GoToPreviousPageProps } from '@phuocng/rpv-page-navigation';
import { PrintProps } from '@phuocng/rpv-print';
import { ShowPropertiesProps, ShowPropertiesMenuItemProps } from '@phuocng/rpv-properties';
import { RotateDecoratorProps, RotateProps } from '@phuocng/rpv-rotate';
import { SwitchScrollModeMenuItemProps, SwitchScrollModeProps } from '@phuocng/rpv-scroll-mode';
import { CurrentScaleProps, ZoomProps, ZoomInProps, ZoomOutProps } from '@phuocng/rpv-zoom';

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
    ShowProperties(props: ShowPropertiesProps): ReactElement;
    ShowPropertiesMenuItem(props: ShowPropertiesMenuItemProps): ReactElement;
    SwitchScrollMode(props: SwitchScrollModeProps): ReactElement;
    SwitchScrollModeMenuItem(props: SwitchScrollModeMenuItemProps): ReactElement;
    Zoom(props: ZoomProps): ReactElement;
    ZoomIn(props: ZoomInProps): ReactElement;
    ZoomOut(props: ZoomOutProps): ReactElement;
}

export type RenderToolbarSlot = (toolbarSlot: ToolbarSlot) => ReactElement;
export type RenderToolbar = (renderToolbar: RenderToolbarSlot) => ReactElement;

export interface ToolbarProps {
    children?: RenderToolbarSlot;
}

export interface ToolbarPlugin extends Plugin {
    Toolbar: (props: ToolbarProps) => ReactElement;
}

export default function toolbarPlugin(): ToolbarPlugin;
