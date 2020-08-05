/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { ReactElement } from 'react';
import { createStore, Plugin, PluginFunctions, PluginOnDocumentLoad, ViewerState } from '@phuocng/rpv';

import ThumbnailListWithStore from './ThumbnailListWithStore';
import StoreProps from './StoreProps';

interface ThumbnailPlugin extends Plugin {
    Thumbnails: () => ReactElement;
}

const thumbnailPlugin = (): ThumbnailPlugin => {
    const store = createStore<StoreProps>({});

    const ThumbnailsDecorator = () => (
        <ThumbnailListWithStore store={store} />
    );

    return {
        install: (pluginFunctions: PluginFunctions) => {
            store.update('jumpToPage', pluginFunctions.jumpToPage);
        },
        onDocumentLoad: (props: PluginOnDocumentLoad) => {
            store.update('doc', props.doc);
        },
        onViewerStateChange: (state: ViewerState) => {
            store.update('pageHeight', state.pageHeight);
            store.update('pageWidth', state.pageWidth);
            return state;
        },
        Thumbnails: ThumbnailsDecorator,
    };
};

export default thumbnailPlugin;
