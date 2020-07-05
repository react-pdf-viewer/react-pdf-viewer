/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';
import { createStore, Plugin, PluginFunctions, PluginOnDocumentLoad, ViewerState } from '@phuocng/rpv';

import NextPageButton, { NextPageButtonProps } from './NextPageButton';

import StoreProps from './StoreProps';

interface NextPagePlugin extends Plugin {
    NextPageButton: (props: NextPageButtonProps) => React.ReactElement;
}

const nextPagePlugin = (): NextPagePlugin => {
    const store = createStore<StoreProps>({});

    const NextPageButtonDecorator = (props: NextPageButtonProps) => (
        <NextPageButton {...props} store={store} />
    );

    return {
        install: (pluginFunctions: PluginFunctions) => {
            store.update('jumpToPage', pluginFunctions.jumpToPage);
        },
        onDocumentLoad: (props: PluginOnDocumentLoad) => {
            store.update('numberOfPages', props.doc.numPages);
        },
        onViewerStateChange: (viewerState: ViewerState) => {
            store.update('currentPage', viewerState.pageIndex);
            return viewerState;
        },
        NextPageButton: NextPageButtonDecorator,
    };
};

export default nextPagePlugin;
