/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { Fragment } from 'react';

import { Plugin, PluginFunctions, PluginOnDocumentLoad, ViewerState } from '@phuocng/rpv';
import currentPagePlugin from '@phuocng/rpv-current-page';
import firstPagePlugin from '@phuocng/rpv-first-page';
import fullScreenPlugin from '@phuocng/rpv-full-screen';
import lastPagePlugin from '@phuocng/rpv-last-page';
import nextPagePlugin from '@phuocng/rpv-next-page';
import previousPagePlugin from '@phuocng/rpv-previous-page';

import Toolbar, { ToolbarProps } from './Toolbar';

interface ToolbarPlugin extends Plugin {
    Toolbar: (props: ToolbarProps) => React.ReactElement;
}

const toolbarPlugin = (): ToolbarPlugin => {
    const currentPagePluginInstance = currentPagePlugin();
    const firstPagePluginInstance = firstPagePlugin();
    const fullScreenPluginInstance = fullScreenPlugin();
    const lastPagePluginInstance = lastPagePlugin();
    const nextPagePluginInstance = nextPagePlugin();
    const previousPagePluginInstance = previousPagePlugin();

    const plugins = [
        currentPagePluginInstance,
        firstPagePluginInstance,
        fullScreenPluginInstance,
        lastPagePluginInstance,
        nextPagePluginInstance,
        previousPagePluginInstance,
    ];

    const ToolbarDecorator = (props: ToolbarProps) => {
        const { CurrentPageInput, CurrentPageLabel } = currentPagePluginInstance;
        const { GoToFirstPageButton } = firstPagePluginInstance;
        const { EnterFullScreenButton } = fullScreenPluginInstance;
        const { GoToLastPageButton } = lastPagePluginInstance;
        const { NextPageButton } = nextPagePluginInstance;
        const { PreviousPageButton } = previousPagePluginInstance;
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
                    fullScreenButton: <EnterFullScreenButton />,
                    goToFirstPage: <GoToFirstPageButton />,
                    goToLastPage: <GoToLastPageButton />,
                    nextPage: <NextPageButton />,
                    numberOfPages: <NumberOfPages />,
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
        renderBody: () => (
            <>
            {
                plugins.map((plugin, idx) => (
                    <Fragment key={idx}>
                        {plugin.renderBody && plugin.renderBody()}
                    </Fragment>
                ))
            }
            </>
        ),
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
