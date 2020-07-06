/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';
import { createStore, Plugin, PluginFunctions, ViewerState } from '@phuocng/rpv';

import PreviousPageButton, { PreviousPageButtonProps } from './PreviousPageButton';

import StoreProps from './StoreProps';

interface PreviousPagePlugin extends Plugin {
    PreviousPageButton: (props: PreviousPageButtonProps) => React.ReactElement;
}

const previousPagePlugin = (): PreviousPagePlugin => {
    const store = createStore<StoreProps>({});

    const PreviousPageButtonDecorator = (props: PreviousPageButtonProps) => (
        <PreviousPageButton {...props} store={store} />
    );

    return {
        install: (pluginFunctions: PluginFunctions) => {
            store.update('jumpToPage', pluginFunctions.jumpToPage);
        },
        onViewerStateChange: (viewerState: ViewerState) => {
            store.update('currentPage', viewerState.pageIndex);
            return viewerState;
        },
        PreviousPageButton: PreviousPageButtonDecorator,
    };
};

export default previousPagePlugin;
