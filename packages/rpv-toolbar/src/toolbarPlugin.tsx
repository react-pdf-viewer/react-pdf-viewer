/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import { Plugin, PluginFunctions, PluginOnDocumentLoad, RenderViewerProps, ViewerState } from '@phuocng/rpv';
import downloadPlugin from '@phuocng/rpv-download';
import dropPlugin from '@phuocng/rpv-drop';
import fullScreenPlugin from '@phuocng/rpv-full-screen';
import openPlugin from '@phuocng/rpv-open';
import pageNavigationPlugin from '@phuocng/rpv-page-navigation';
import printPlugin from '@phuocng/rpv-print';
import zoomPlugin from '@phuocng/rpv-zoom';

import '@phuocng/rpv-drop/cjs/rpv-drop.css';
import '@phuocng/rpv-full-screen/cjs/rpv-full-screen.css';
import '@phuocng/rpv-open/cjs/rpv-open.css';
import '@phuocng/rpv-page-navigation/cjs/rpv-page-navigation.css';
import '@phuocng/rpv-print/cjs/rpv-print.css';
import '@phuocng/rpv-zoom/cjs/rpv-zoom.css';

import Toolbar, { ToolbarProps } from './Toolbar';

interface ToolbarPlugin extends Plugin {
    Toolbar: (props: ToolbarProps) => React.ReactElement;
}

const toolbarPlugin = (): ToolbarPlugin => {
    const downloadPluginInstance = downloadPlugin();
    const dropPluginInstance = dropPlugin();
    const fullScreenPluginInstance = fullScreenPlugin();
    const openPluginInstance = openPlugin();
    const pageNavigationPluginInstance = pageNavigationPlugin();
    const printPluginInstance = printPlugin();
    const zoomPluginInstance = zoomPlugin();

    const plugins = [
        downloadPluginInstance,
        dropPluginInstance,
        fullScreenPluginInstance,
        openPluginInstance,
        pageNavigationPluginInstance,
        printPluginInstance,
        zoomPluginInstance,
    ];

    const ToolbarDecorator = (props: ToolbarProps) => {
        const { Download } = downloadPluginInstance;
        const { EnterFullScreen } = fullScreenPluginInstance;
        const { Open } = openPluginInstance;
        const { CurrentPageInput, CurrentPageLabel, GoToFirstPage, GoToLastPage, GoToNextPage, GoToPreviousPage } = pageNavigationPluginInstance;
        const { Print } = printPluginInstance;
        const { CurrentScale, Zoom, ZoomIn, ZoomOut } = zoomPluginInstance;

        const NumberOfPages = () => (
            <CurrentPageLabel>
                {
                    (props) => <>{props.numberOfPages}</>
                }
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
                    GoToLastPage,
                    GoToNextPage,
                    GoToPreviousPage,
                    NumberOfPages,
                    Open,
                    Print,
                    Zoom,
                    ZoomIn,
                    ZoomOut,
                }}
            />
        );
    };

    return {
        install: (pluginFunctions: PluginFunctions) => {
            // Install plugins
            plugins.forEach(plugin => {
                if (plugin.install) {
                    plugin.install(pluginFunctions);
                }
            });
        },
        renderViewer: (props: RenderViewerProps) => {
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
