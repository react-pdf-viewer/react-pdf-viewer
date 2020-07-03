import React, { useEffect, useState } from 'react';
import { createStore, Plugin, PluginFunctions, ViewerState, ScrollMode } from '@phuocng/react-pdf-viewer';

interface PageNavigationPlugin extends Plugin {
    NextPageButton: () => React.ReactElement;
    PreviousPageButton: () => React.ReactElement;
}

interface StoreProps {
    jumpToPage?(pageIndex: number): void;
    getViewerState?: () => ViewerState;
}

const pageNavigationPlugin = (): PageNavigationPlugin => {
    const store = createStore<StoreProps>({});

    const goToNextPage = () => {
        const editorState = store.get('getViewerState')();
        store.get('jumpToPage')(editorState.pageIndex + 1);
    };

    const goToPreviousPage = () => {
        const editorState = store.get('getViewerState')();
        store.get('jumpToPage')(editorState.pageIndex - 1);
    };

    const PreviousPageButton = () => {
        return (
            <button onClick={goToNextPage}>Next</button>
        );
    };

    const NextPageButton = () => {
        return (
            <button onClick={goToPreviousPage}>Previous</button>
        );
    };

    return {
        install: (pluginFunctions: PluginFunctions) => {
            store.update('jumpToPage', pluginFunctions.jumpToPage);
            store.update('getViewerState', pluginFunctions.getViewerState);
        },
        NextPageButton,
        PreviousPageButton,
    };
};

export default pageNavigationPlugin;
