/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';
import { createStore, Plugin, PluginOnDocumentLoad, ViewerState } from '@phuocng/rpv';

import CurrentPageLabel, { CurrentPageLabelProps } from './CurrentPageLabel';
import StoreProps from './StoreProps';

export interface CurrentPagePlugin extends Plugin {
    CurrentPageLabel: (props: CurrentPageLabelProps) => React.ReactElement;
}

const currentPagePlugin = (): CurrentPagePlugin => {
    const store = createStore<StoreProps>();

    const CurrentPageLabelDecorator = (props: CurrentPageLabelProps) => <CurrentPageLabel {...props} store={store} />;

    return {
        onDocumentLoad: (props: PluginOnDocumentLoad) => {
            store.update('numberOfPages', props.doc.numPages);
        },
        onViewerStateChange: (viewerState: ViewerState): ViewerState => {
            store.update('currentPage', viewerState.pageIndex);
            return viewerState;
        },
        CurrentPageLabel: CurrentPageLabelDecorator,
    };
};

export default currentPagePlugin;
