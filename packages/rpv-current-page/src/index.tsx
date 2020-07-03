import React, { useEffect, useState } from 'react';
import { createStore, Plugin, StoreHandler, ViewerState } from '@phuocng/rpv';

interface CurrentPagePlugin extends Plugin {
    CurrentPageLabel: () => React.ReactElement;
}

interface StoreProps {
    pageIndex?: number;
}

const currentPagePlugin = (): CurrentPagePlugin => {
    const store = createStore<StoreProps>();

    const CurrentPageLabel = () => {
        const [currentPage, setCurrentPage] = useState<number>(0);

        useEffect(() => {
            const handlePageIndex: StoreHandler<number> = (p: number) => setCurrentPage(p);
            store.subscribe('pageIndex', handlePageIndex);

            return () => {
                store.unsubscribe('pageIndex', handlePageIndex);
            };
        }, []);

        return (
            <div>{currentPage + 1}</div>
        );
    };

    return {
        onViewerStateChange: (viewerState: ViewerState): ViewerState => {
            console.log('currentPagePlugin.onViewerStateChange', viewerState);
            store.update('pageIndex', viewerState.pageIndex);
            return viewerState;
        },
        CurrentPageLabel,
    };
};

export default currentPagePlugin;
