/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import { Plugin, PluginFunctions, PluginOnDocumentLoad, ViewerState } from '@phuocng/rpv';
import currentPagePlugin from '@phuocng/rpv-current-page';
import firstPagePlugin from '@phuocng/rpv-first-page';
import nextPagePlugin from '@phuocng/rpv-next-page';
import previousPagePlugin from '@phuocng/rpv-previous-page';

import Toolbar, { ToolbarProps } from './Toolbar';

interface ToolbarPlugin extends Plugin {
    Toolbar: (props: ToolbarProps) => React.ReactElement;
}

const toolbarPlugin = (): ToolbarPlugin => {
    const currentPagePluginInstance = currentPagePlugin();
    const firstPagePluginInstance = firstPagePlugin();
    const nextPagePluginInstance = nextPagePlugin();
    const previousPagePluginInstance = previousPagePlugin();

    const plugins = [
        currentPagePluginInstance,
        firstPagePluginInstance,
        nextPagePluginInstance,
        previousPagePluginInstance,
    ];

    const ToolbarDecorator = (props: ToolbarProps) => {
        const { CurrentPageLabel } = currentPagePluginInstance;
        const { GoToFirstPageButton } = firstPagePluginInstance;
        const { NextPageButton } = nextPagePluginInstance;
        const { PreviousPageButton } = previousPagePluginInstance;

        return (
            <Toolbar
                {...props}
                slot={{
                    currentPage: <CurrentPageLabel />,
                    goToFirstPage: <GoToFirstPageButton />,
                    nextPage: <NextPageButton />,
                    previousPage: <PreviousPageButton />,
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
