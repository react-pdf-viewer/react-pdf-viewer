/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';
import { createStore, Plugin, PluginFunctions, RenderViewer, Slot } from '@react-pdf-viewer/core';

import StoreProps from './StoreProps';
import Tracker from './Tracker';

interface HighlightPlugin extends Plugin {
}

const highlightPlugin = (): HighlightPlugin => {
    const store = createStore<StoreProps>();

    const renderViewer = (props: RenderViewer): Slot => {
        const currentSlot = props.slot;
        if (currentSlot.subSlot && currentSlot.subSlot.children) {
            currentSlot.subSlot.children = (
                <>
                <Tracker store={store} />
                {currentSlot.subSlot.children}
                </>
            );
        }

        return currentSlot;
    };

    return {
        install: (pluginFunctions: PluginFunctions) => {
            store.update('getPagesRef', pluginFunctions.getPagesRef);
        },
        renderViewer,
    };
};

export default highlightPlugin;
