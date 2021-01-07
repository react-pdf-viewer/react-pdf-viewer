/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { createStore, Plugin, PluginFunctions, PluginOnDocumentLoad } from '@react-pdf-viewer/core';

import BookmarkListWithStore from './BookmarkListWithStore';
import StoreProps from './StoreProps';

interface BookmarkPlugin extends Plugin {
    Bookmarks: () => React.ReactElement;
}

const bookmarkPlugin = (): BookmarkPlugin => {
    const store = React.useMemo(() => createStore<StoreProps>({}), []);

    const BookmarksDecorator = () => (
        <BookmarkListWithStore store={store} />
    );

    return {
        install: (pluginFunctions: PluginFunctions) => {
            store.update('jumpToDestination', pluginFunctions.jumpToDestination);
        },
        onDocumentLoad: (props: PluginOnDocumentLoad) => {
            store.update('doc', props.doc);
        },
        Bookmarks: BookmarksDecorator,
    };
};

export default bookmarkPlugin;
