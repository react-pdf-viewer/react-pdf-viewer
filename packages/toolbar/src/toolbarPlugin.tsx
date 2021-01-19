/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Plugin, PluginFunctions, PluginOnDocumentLoad, RenderViewer, ViewerState, PluginOnTextLayerRender } from '@react-pdf-viewer/core';
import { dropPlugin } from '@react-pdf-viewer/drop';
import { fullScreenPlugin, FullScreenPlugin, FullScreenPluginProps } from '@react-pdf-viewer/full-screen';
import { getFilePlugin, GetFilePlugin, GetFilePluginProps } from '@react-pdf-viewer/get-file';
import { openPlugin, OpenPlugin } from '@react-pdf-viewer/open';
import { pageNavigationPlugin, PageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import { printPlugin, PrintPlugin } from '@react-pdf-viewer/print';
import { propertiesPlugin, PropertiesPlugin } from '@react-pdf-viewer/properties';
import { rotatePlugin, RotatePlugin } from '@react-pdf-viewer/rotate';
import { scrollModePlugin, ScrollModePlugin, ScrollModePluginProps } from '@react-pdf-viewer/scroll-mode';
import { searchPlugin, SearchPlugin, SearchPluginProps } from '@react-pdf-viewer/search';
import { selectionModePlugin, SelectionModePlugin, SelectionModePluginProps } from '@react-pdf-viewer/selection-mode';
import { zoomPlugin, ZoomPlugin } from '@react-pdf-viewer/zoom';

import Toolbar, { ToolbarProps } from './Toolbar';

interface ToolbarPlugin extends Plugin {
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

const toolbarPlugin = (props?: ToolbarPluginProps): ToolbarPlugin => {
    const dropPluginInstance = dropPlugin();
    const fullScreenPluginInstance = fullScreenPlugin(props ? props.fullScreenPlugin : {});
    const getFilePluginInstance = getFilePlugin(props ? props.getFilePlugin : {});
    const openPluginInstance = openPlugin();
    const pageNavigationPluginInstance = pageNavigationPlugin();
    const printPluginInstance = printPlugin();
    const propertiesPluginInstance = propertiesPlugin();
    const rotatePluginInstance = rotatePlugin();
    const scrollModePluginInstance = scrollModePlugin(props ? props.scrollModePlugin : {});
    const searchPluginInstance = searchPlugin(props ? props.searchPlugin : {});
    const selectionModePluginInstance = selectionModePlugin(props ? props.selectionModePlugin : {});
    const zoomPluginInstance = zoomPlugin();

    const plugins = [
        dropPluginInstance,
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
        zoomPluginInstance,
    ];

    const ToolbarDecorator = (props: ToolbarProps) => {
        const { EnterFullScreen } = fullScreenPluginInstance;
        const { Download } = getFilePluginInstance;
        const { Open } = openPluginInstance;
        const {
            CurrentPageInput, CurrentPageLabel, GoToFirstPage, GoToFirstPageMenuItem, GoToLastPage,
            GoToLastPageMenuItem, GoToNextPage, GoToPreviousPage,
        } = pageNavigationPluginInstance;
        const { Print } = printPluginInstance;
        const { ShowProperties, ShowPropertiesMenuItem } = propertiesPluginInstance;
        const { Rotate, RotateBackwardMenuItem, RotateForwardMenuItem } = rotatePluginInstance;
        const { SwitchScrollMode, SwitchScrollModeMenuItem } = scrollModePluginInstance;
        const { Search, ShowSearchPopover } = searchPluginInstance;
        const { SwitchSelectionMode, SwitchSelectionModeMenuItem } = selectionModePluginInstance;
        const { CurrentScale, Zoom, ZoomIn, ZoomOut } = zoomPluginInstance;

        const NumberOfPages = () => (
            <CurrentPageLabel>
                {(props) => <>{props.numberOfPages}</>}
            </CurrentPageLabel>
        );

        return (
            <Toolbar
                {...props}
                slot={{
                    CurrentPageInput,
                    CurrentPageLabel,
                    CurrentScale,
                    Download,
                    EnterFullScreen,
                    GoToFirstPage,
                    GoToFirstPageMenuItem,
                    GoToLastPage,
                    GoToLastPageMenuItem,
                    GoToNextPage,
                    GoToPreviousPage,
                    NumberOfPages,
                    Open,
                    Print,
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
                    Zoom,
                    ZoomIn,
                    ZoomOut,
                }}
            />
        );
    };

    return {
        // Plugin instances
        dropPluginInstance,
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
        zoomPluginInstance,
        install: (pluginFunctions: PluginFunctions) => {
            // Install plugins
            plugins.forEach(plugin => {
                if (plugin.install) {
                    plugin.install(pluginFunctions);
                }
            });
        },
        renderViewer: (props: RenderViewer) => {
            let { slot } = props;
            plugins.forEach(plugin => {
                if (plugin.renderViewer) {
                    slot = plugin.renderViewer({...props, slot});
                }
            });
            return slot;
        },
        uninstall: (pluginFunctions: PluginFunctions) => {
            // Unistall plugins
            plugins.forEach(plugin => {
                if (plugin.uninstall) {
                    plugin.uninstall(pluginFunctions);
                }
            });
        },
        onDocumentLoad: (props: PluginOnDocumentLoad) => {
            plugins.forEach(plugin => {
                if (plugin.onDocumentLoad) {
                    plugin.onDocumentLoad(props);
                }
            });
        },
        onTextLayerRender: (props: PluginOnTextLayerRender) => {
            plugins.forEach(plugin => {
                if (plugin.onTextLayerRender) {
                    plugin.onTextLayerRender(props);
                }
            });
        },
        onViewerStateChange: (viewerState: ViewerState) => {
            let newState = viewerState;
            plugins.forEach(plugin => {
                if (plugin.onViewerStateChange) {
                    newState = plugin.onViewerStateChange(newState);
                }
            });
            return newState;
        },
        Toolbar: ToolbarDecorator,
    };
};

export default toolbarPlugin;
