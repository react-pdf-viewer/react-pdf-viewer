import React, { useEffect, useState } from 'react';
import { Plugin, PluginFunctions, ViewerState } from '@phuocng/react-pdf-viewer';

import createStore from './createStore';

interface CurrentPagePlugin extends Plugin {
    CurrentPageLabel: () => React.ReactElement
}

interface StoreProps {
    pageIndex?: number;
}

const currentPagePlugin = (): CurrentPagePlugin => {
    const store = createStore<StoreProps>({});

    const CurrentPageLabel = () => {
        const [currentPage, setCurrentPage] = useState(0);

        useEffect(() => {
            store.subscribe('pageIndex', setCurrentPage);

            return () => {
                store.unsubscribe('pageIndex', setCurrentPage);
            };
        }, []);

        return (
            <div>{currentPage + 1}</div>
        );
    };

    return {
        install: (pluginFunctions: PluginFunctions) => {
            console.log('Install currentPagePlugin');
        },
        uninstall: (pluginFunctions: PluginFunctions) => {

        },
        onViewerStateChange: (viewerState: ViewerState): ViewerState => {
            console.log('currentPagePlugin: page changed to', viewerState.pageIndex);
            store.update('pageIndex', viewerState.pageIndex);
            return viewerState;
        },
        CurrentPageLabel,
    };
};

export default currentPagePlugin;
