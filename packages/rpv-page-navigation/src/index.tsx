import React from 'react';
import { createStore, Plugin, PluginFunctions, PluginOnDocumentLoad, ViewerState } from '@phuocng/rpv';

import PreviousPageButton, { PreviousPageButtonProps } from './PreviousPageButton';
import NextPageButton, { NextPageButtonProps } from './NextPageButton';

import StoreProps from './StoreProps';

interface PageNavigationPlugin extends Plugin {
    NextPageButton: (props: NextPageButtonProps) => React.ReactElement;
    PreviousPageButton: (props: PreviousPageButtonProps) => React.ReactElement;
}

const pageNavigationPlugin = (): PageNavigationPlugin => {
    const store = createStore<StoreProps>();

    const NextPageButtonDecorator = (props: NextPageButtonProps) => (
        <NextPageButton {...props} store={store} />
    );
    const PreviousPageButtonDecorator = (props: PreviousPageButtonProps) => (
        <PreviousPageButton {...props} store={store} />
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
        PreviousPageButton: PreviousPageButtonDecorator,
    };
};

export default pageNavigationPlugin;
