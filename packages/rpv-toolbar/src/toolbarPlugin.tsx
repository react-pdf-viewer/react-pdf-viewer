/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import { Plugin, PluginFunctions, PluginOnDocumentLoad, RenderViewerProps, ViewerState } from '@phuocng/rpv';
import currentPagePlugin from '@phuocng/rpv-current-page';
import downloadPlugin from '@phuocng/rpv-download';
import dropPlugin from '@phuocng/rpv-drop';
import firstPagePlugin from '@phuocng/rpv-first-page';
import fullScreenPlugin from '@phuocng/rpv-full-screen';
import lastPagePlugin from '@phuocng/rpv-last-page';
import nextPagePlugin from '@phuocng/rpv-next-page';
import openPlugin from '@phuocng/rpv-open';
import previousPagePlugin from '@phuocng/rpv-previous-page';
import printPlugin from '@phuocng/rpv-print';
import zoomInPlugin from '@phuocng/rpv-zoom-in';

import '@phuocng/rpv-current-page/cjs/rpv-current-page.css';
import '@phuocng/rpv-drop/cjs/rpv-drop.css';
import '@phuocng/rpv-full-screen/cjs/rpv-full-screen.css';
import '@phuocng/rpv-open/cjs/rpv-open.css';
import '@phuocng/rpv-print/cjs/rpv-print.css';

import Toolbar, { ToolbarProps } from './Toolbar';

interface ToolbarPlugin extends Plugin {
    Toolbar: (props: ToolbarProps) => React.ReactElement;
}

const toolbarPlugin = (): ToolbarPlugin => {
    const currentPagePluginInstance = currentPagePlugin();
    const downloadPluginInstance = downloadPlugin();
    const dropPluginInstance = dropPlugin();
    const firstPagePluginInstance = firstPagePlugin();
    const fullScreenPluginInstance = fullScreenPlugin();
    const lastPagePluginInstance = lastPagePlugin();
    const nextPagePluginInstance = nextPagePlugin();
    const openPluginInstance = openPlugin();
    const previousPagePluginInstance = previousPagePlugin();
    const printPluginInstance = printPlugin();
    const zoomInPluginInstance = zoomInPlugin();

    const plugins = [
        currentPagePluginInstance,
        downloadPluginInstance,
        dropPluginInstance,
        firstPagePluginInstance,
        fullScreenPluginInstance,
        lastPagePluginInstance,
        nextPagePluginInstance,
        openPluginInstance,
        previousPagePluginInstance,
        printPluginInstance,
        zoomInPluginInstance,
    ];

    const ToolbarDecorator = (props: ToolbarProps) => {
        const { CurrentPageInput, CurrentPageLabel } = currentPagePluginInstance;
        const { DownloadButton } = downloadPluginInstance;
        const { GoToFirstPageButton } = firstPagePluginInstance;
        const { EnterFullScreenButton } = fullScreenPluginInstance;
        const { GoToLastPageButton } = lastPagePluginInstance;
        const { NextPageButton } = nextPagePluginInstance;
        const { OpenButton } = openPluginInstance;
        const { PreviousPageButton } = previousPagePluginInstance;
        const { PrintButton } = printPluginInstance;
        const { ZoomInButton } = zoomInPluginInstance;

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
                    currentPage: <CurrentPageLabel />,
                    currentPageInput: <CurrentPageInput />,
                    downloadButton: <DownloadButton />,
                    fullScreenButton: <EnterFullScreenButton />,
                    goToFirstPage: <GoToFirstPageButton />,
                    goToLastPage: <GoToLastPageButton />,
                    nextPage: <NextPageButton />,
                    numberOfPages: <NumberOfPages />,
                    openFileButton: <OpenButton />,
                    previousPage: <PreviousPageButton />,
                    printButton: <PrintButton />,
                    zoomInButton: <ZoomInButton />,
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
