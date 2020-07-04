import React from 'react';
import { createStore, Plugin, PluginFunctions, ViewerState } from '@phuocng/rpv';

import PreviousPageButton from './PreviousPageButton';
import NextPageButton from './NextPageButton';
import StoreProps from './StoreProps';

interface PageNavigationPlugin extends Plugin {
    NextPageButton: () => React.ReactElement;
    PreviousPageButton: () => React.ReactElement;
}

const pageNavigationPlugin = (): PageNavigationPlugin => {
    const store = createStore<StoreProps>();

    const DecoratedNextPageButton = () => <NextPageButton store={store} />;
    const DecoratedPreviousPageButton = () => <PreviousPageButton store={store} />;

    return {
        install: (pluginFunctions: PluginFunctions) => {
            store.update('jumpToPage', pluginFunctions.jumpToPage);
            store.update('getViewerState', pluginFunctions.getViewerState);
        },
        NextPageButton: DecoratedNextPageButton,
        PreviousPageButton: DecoratedPreviousPageButton,
    };
};

export default pageNavigationPlugin;
