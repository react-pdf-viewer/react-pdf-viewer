import React from 'react';
import { createStore, Plugin, ViewerState } from '@phuocng/rpv';

import CurrentPageLabel from './CurrentPageLabel';
import StoreProps from './StoreProps';

interface CurrentPagePlugin extends Plugin {
    CurrentPageLabel: () => React.ReactElement;
}

const currentPagePlugin = (): CurrentPagePlugin => {
    const store = createStore<StoreProps>();

    const CurrentPageLabelDecorator = () => <CurrentPageLabel store={store} />;

    return {
        onViewerStateChange: (viewerState: ViewerState): ViewerState => {
            store.update('currentPage', viewerState.pageIndex);
            return viewerState;
        },
        CurrentPageLabel: CurrentPageLabelDecorator,
    };
};

export default currentPagePlugin;
