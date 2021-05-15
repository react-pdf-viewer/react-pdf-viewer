/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import {
    EnterFullScreenMenuItemProps,
    EnterFullScreenProps,
} from '@react-pdf-viewer/full-screen';
import {
    DownloadMenuItemProps,
    DownloadProps,
} from '@react-pdf-viewer/get-file';
import { OpenProps } from '@react-pdf-viewer/open';
import {
    CurrentPageLabelProps,
    GoToFirstPageMenuItemProps,
    GoToFirstPageProps,
    GoToLastPageMenuItemProps,
    GoToLastPageProps,
    GoToNextPageProps,
    GoToPreviousPageProps,
    RenderGoToNextPageProps,
    RenderGoToPreviousPageProps,
} from '@react-pdf-viewer/page-navigation';
import { PrintMenuItemProps, PrintProps } from '@react-pdf-viewer/print';
import {
    ShowPropertiesProps,
    ShowPropertiesMenuItemProps,
} from '@react-pdf-viewer/properties';
import { RotateDecoratorProps, RotateProps } from '@react-pdf-viewer/rotate';
import {
    SwitchScrollModeMenuItemProps,
    SwitchScrollModeProps,
} from '@react-pdf-viewer/scroll-mode';
import { SearchProps, ShowSearchPopoverProps } from '@react-pdf-viewer/search';
import {
    SwitchSelectionModeMenuItemProps,
    SwitchSelectionModeProps,
} from '@react-pdf-viewer/selection-mode';
import {
    CurrentScaleProps,
    ZoomProps,
    ZoomInProps,
    ZoomOutProps,
} from '@react-pdf-viewer/zoom';

export default interface ToolbarSlot {
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
