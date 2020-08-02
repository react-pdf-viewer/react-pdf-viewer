/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { ReactElement } from 'react';
import { createStore, Plugin, PluginFunctions, PluginOnDocumentLoad, PluginOnTextLayerRender, RenderViewer, Slot } from '@phuocng/rpv';

import ShowSearchPopover, { ShowSearchPopoverProps } from './ShowSearchPopover';
import StoreProps from './StoreProps';
import Tracker from './Tracker';

interface SearchPlugin extends Plugin {
    ShowSearchPopover(props: ShowSearchPopoverProps): ReactElement;
}

const searchPlugin = (): SearchPlugin => {
    const store = createStore<StoreProps>({
        renderStatus: new Map<number, PluginOnTextLayerRender>(),
    });

    const ShowSearchPopoverDecorator = (props: ShowSearchPopoverProps) => (
        <ShowSearchPopover {...props} store={store} />
    );

    const renderViewer = (props: RenderViewer): Slot => {
        let currentSlot = props.slot;
        if (currentSlot.children) {
            currentSlot.children = (
                <>
                {
                    Array(props.doc.numPages).fill(0).map((_, index) => (
                        <Tracker key={index} pageIndex={index} store={store} />
                    ))
                }
                {currentSlot.children}
                </>
            );
        }

        return currentSlot;
    };

    return {
        install: (props: PluginFunctions) => {
            store.update('jumpToDestination', props.jumpToDestination);
            store.update('jumpToPage', props.jumpToPage);
        },
        renderViewer,
        uninstall: (props: PluginFunctions) => {
            const renderStatus = store.get('renderStatus');
            if (renderStatus) {
                renderStatus.clear();
            }
        },
        onDocumentLoad: (props: PluginOnDocumentLoad) => {
            store.update('doc', props.doc);
        },
        onTextLayerRender: (props: PluginOnTextLayerRender) => {
            let renderStatus = store.get('renderStatus');
            if (renderStatus) {
                renderStatus = renderStatus.set(props.pageIndex, props);
                store.update('renderStatus', renderStatus);
            }
        },
        ShowSearchPopover: ShowSearchPopoverDecorator,
    };
};

export default searchPlugin;
