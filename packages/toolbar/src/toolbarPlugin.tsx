/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import { type Plugin } from '@react-pdf-viewer/core';
import { fullScreenPlugin, type FullScreenPlugin, type FullScreenPluginProps } from '@react-pdf-viewer/full-screen';
import { getFilePlugin, type GetFilePlugin, type GetFilePluginProps } from '@react-pdf-viewer/get-file';
import { openPlugin, type OpenPlugin, type OpenPluginProps } from '@react-pdf-viewer/open';
import {
    pageNavigationPlugin,
    type PageNavigationPlugin,
    type PageNavigationPluginProps,
} from '@react-pdf-viewer/page-navigation';
import { printPlugin, type PrintPlugin, type PrintPluginProps } from '@react-pdf-viewer/print';
import { propertiesPlugin, type PropertiesPlugin } from '@react-pdf-viewer/properties';
import { rotatePlugin, type RotatePlugin } from '@react-pdf-viewer/rotate';
import { scrollModePlugin, type ScrollModePlugin } from '@react-pdf-viewer/scroll-mode';
import { searchPlugin, type SearchPlugin, type SearchPluginProps } from '@react-pdf-viewer/search';
import {
    selectionModePlugin,
    type SelectionModePlugin,
    type SelectionModePluginProps,
} from '@react-pdf-viewer/selection-mode';
import { themePlugin, type ThemePlugin } from '@react-pdf-viewer/theme';
import { zoomPlugin, type ZoomPlugin, type ZoomPluginProps } from '@react-pdf-viewer/zoom';
import * as React from 'react';
import { Toolbar, ToolbarProps } from './Toolbar';
import { renderDefaultToolbar } from './renderDefaultToolbar';
import { type ToolbarSlot } from './types/ToolbarSlot';
import { type TransformToolbarSlot } from './types/TransformToolbarSlot';

export interface ToolbarPlugin extends Plugin {
    renderDefaultToolbar: (
        transformToolbarSlot: TransformToolbarSlot,
    ) => (defaultToolbarSlot: ToolbarSlot) => React.ReactElement;
    Toolbar: (props: ToolbarProps) => React.ReactElement;
    // Plugins instance
    readonly fullScreenPluginInstance: FullScreenPlugin;
    readonly getFilePluginInstance: GetFilePlugin;
    readonly openPluginInstance: OpenPlugin;
    readonly pageNavigationPluginInstance: PageNavigationPlugin;
    readonly printPluginInstance: PrintPlugin;
    readonly propertiesPluginInstance: PropertiesPlugin;
    readonly rotatePluginInstance: RotatePlugin;
    readonly scrollModePluginInstance: ScrollModePlugin;
    readonly searchPluginInstance: SearchPlugin;
    readonly selectionModePluginInstance: SelectionModePlugin;
    readonly themePluginInstance: ThemePlugin;
    readonly zoomPluginInstance: ZoomPlugin;
}

export interface ToolbarPluginProps {
    fullScreenPlugin?: FullScreenPluginProps;
    getFilePlugin?: GetFilePluginProps;
    openPlugin?: OpenPluginProps;
    pageNavigationPlugin?: PageNavigationPluginProps;
    printPlugin?: PrintPluginProps;
    searchPlugin?: SearchPluginProps;
    selectionModePlugin?: SelectionModePluginProps;
    zoomPlugin?: ZoomPluginProps;
}

export const toolbarPlugin = (props?: ToolbarPluginProps): ToolbarPlugin => {
    const fullScreenPluginInstance = fullScreenPlugin(props ? props.fullScreenPlugin : {});
    const getFilePluginInstance = getFilePlugin(props ? props.getFilePlugin : {});
    const openPluginInstance = openPlugin(props ? props.openPlugin : {});
    const pageNavigationPluginInstance = pageNavigationPlugin(props ? props.pageNavigationPlugin : {});
    const printPluginInstance = printPlugin(props ? props.printPlugin : {});
    const propertiesPluginInstance = propertiesPlugin();
    const rotatePluginInstance = rotatePlugin();
    const scrollModePluginInstance = scrollModePlugin();
    const searchPluginInstance = searchPlugin(props ? props.searchPlugin : {});
    const selectionModePluginInstance = selectionModePlugin(props ? props.selectionModePlugin : {});
    const themePluginInstance = themePlugin();
    const zoomPluginInstance = zoomPlugin(props ? props.zoomPlugin : {});

    const plugins = [
        fullScreenPluginInstance,
        getFilePluginInstance,
        openPluginInstance,
        pageNavigationPluginInstance,
        printPluginInstance,
        propertiesPluginInstance,
        rotatePluginInstance,
        scrollModePluginInstance,
        searchPluginInstance,
        selectionModePluginInstance,
        themePluginInstance,
        zoomPluginInstance,
    ];

    const ToolbarDecorator = React.useCallback((props: ToolbarProps) => {
        const { EnterFullScreen, EnterFullScreenMenuItem } = fullScreenPluginInstance;
        const { Download, DownloadMenuItem } = getFilePluginInstance;
        const { Open, OpenMenuItem } = openPluginInstance;
        const {
            CurrentPageInput,
            CurrentPageLabel,
            GoToFirstPage,
            GoToFirstPageMenuItem,
            GoToLastPage,
            GoToLastPageMenuItem,
            GoToNextPage,
            GoToNextPageMenuItem,
            GoToPreviousPage,
            GoToPreviousPageMenuItem,
            NumberOfPages,
        } = pageNavigationPluginInstance;
        const { Print, PrintMenuItem } = printPluginInstance;
        const { ShowProperties, ShowPropertiesMenuItem } = propertiesPluginInstance;
        const { Rotate, RotateBackwardMenuItem, RotateForwardMenuItem } = rotatePluginInstance;
        const { SwitchScrollMode, SwitchScrollModeMenuItem, SwitchViewMode, SwitchViewModeMenuItem } =
            scrollModePluginInstance;
        const { Search, ShowSearchPopover } = searchPluginInstance;
        const { SwitchSelectionMode, SwitchSelectionModeMenuItem } = selectionModePluginInstance;
        const { SwitchTheme, SwitchThemeMenuItem } = themePluginInstance;
        const { CurrentScale, Zoom, ZoomIn, ZoomInMenuItem, ZoomOut, ZoomOutMenuItem } = zoomPluginInstance;

        return (
            <Toolbar
                {...props}
                slot={{
                    CurrentPageInput,
                    CurrentPageLabel,
                    CurrentScale,
                    Download,
                    DownloadMenuItem,
                    EnterFullScreen,
                    EnterFullScreenMenuItem,
                    GoToFirstPage,
                    GoToFirstPageMenuItem,
                    GoToLastPage,
                    GoToLastPageMenuItem,
                    GoToNextPage,
                    GoToNextPageMenuItem,
                    GoToPreviousPage,
                    GoToPreviousPageMenuItem,
                    NumberOfPages,
                    Open,
                    OpenMenuItem,
                    Print,
                    PrintMenuItem,
                    Rotate,
                    RotateBackwardMenuItem,
                    RotateForwardMenuItem,
                    Search,
                    ShowProperties,
                    ShowPropertiesMenuItem,
                    ShowSearchPopover,
                    SwitchScrollMode,
                    SwitchScrollModeMenuItem,
                    SwitchSelectionMode,
                    SwitchSelectionModeMenuItem,
                    SwitchViewMode,
                    SwitchViewModeMenuItem,
                    SwitchTheme,
                    SwitchThemeMenuItem,
                    Zoom,
                    ZoomIn,
                    ZoomInMenuItem,
                    ZoomOut,
                    ZoomOutMenuItem,
                }}
            />
        );
    }, []);

    return {
        // Plugin instances
        fullScreenPluginInstance,
        getFilePluginInstance,
        openPluginInstance,
        pageNavigationPluginInstance,
        printPluginInstance,
        propertiesPluginInstance,
        rotatePluginInstance,
        scrollModePluginInstance,
        searchPluginInstance,
        selectionModePluginInstance,
        themePluginInstance,
        zoomPluginInstance,
        dependencies: plugins,
        renderDefaultToolbar,
        Toolbar: ToolbarDecorator,
    };
};
