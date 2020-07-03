import React, { useEffect, useState } from 'react';
import { createStore, Plugin, PluginFunctions, ViewerState } from '@phuocng/react-pdf-viewer';

interface CurrentPagePlugin extends Plugin {
    CurrentPageLabel: () => React.ReactElement;
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
        onViewerStateChange: (viewerState: ViewerState): ViewerState => {
            store.update('pageIndex', viewerState.pageIndex);
            return viewerState;
        },
        CurrentPageLabel,
    };
};

export default currentPagePlugin;
