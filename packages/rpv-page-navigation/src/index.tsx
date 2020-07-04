import React from 'react';
import { createStore, Plugin, PluginFunctions, ViewerState } from '@phuocng/rpv';

import PreviousPageButton, { PreviousPageButtonProps } from './PreviousPageButton';
import NextPageButton, { NextPageButtonProps } from './NextPageButton';

interface PageNavigationPlugin extends Plugin {
    NextPageButton: (props: NextPageButtonProps) => React.ReactElement;
    PreviousPageButton: (props: PreviousPageButtonProps) => React.ReactElement;
}

const pageNavigationPlugin = (): PageNavigationPlugin => {
    const store = createStore<PluginFunctions>();

    const DecoratedNextPageButton = (props: NextPageButtonProps) => (
        <NextPageButton {...props} store={store} />
    );
    const DecoratedPreviousPageButton = (props: PreviousPageButtonProps) => (
        <PreviousPageButton {...props} store={store} />
    );

    return {
        install: (pluginFunctions: PluginFunctions) => {
            store.update('getDocument', pluginFunctions.getDocument);
            store.update('jumpToPage', pluginFunctions.jumpToPage);
            store.update('getViewerState', pluginFunctions.getViewerState);
        },
        NextPageButton: DecoratedNextPageButton,
        PreviousPageButton: DecoratedPreviousPageButton,
    };
};

export default pageNavigationPlugin;
