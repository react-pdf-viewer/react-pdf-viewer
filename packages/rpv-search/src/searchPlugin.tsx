/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { ReactElement } from 'react';
import { createStore, Plugin, PluginOnDocumentLoad } from '@phuocng/rpv';

import ShowSearchPopover, { ShowSearchPopoverProps } from './ShowSearchPopover';
import StoreProps from './StoreProps';

interface SearchPlugin extends Plugin {
    ShowSearchPopover(props: ShowSearchPopoverProps): ReactElement;
}

const searchPlugin = (): SearchPlugin => {
    const store = createStore<StoreProps>();

    const ShowSearchPopoverDecorator = (props: ShowSearchPopoverProps) => (
        <ShowSearchPopover {...props} store={store} />
    );

    return {
        onDocumentLoad: (props: PluginOnDocumentLoad) => {
            store.update('doc', props.doc);
        },
        ShowSearchPopover: ShowSearchPopoverDecorator,
    };
};

export default searchPlugin;
