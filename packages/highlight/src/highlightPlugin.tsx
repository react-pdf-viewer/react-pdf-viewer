/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';
import { createStore, LayerRenderStatus, PluginOnTextLayerRender, Plugin, PluginFunctions, RenderViewer, Slot } from '@react-pdf-viewer/core';

import { NoSelectionState, SelectedState, SelectingState } from './SelectionState';
import StoreProps from './StoreProps';
import Tracker from './Tracker';

interface HighlightPlugin extends Plugin {
}

const highlightPlugin = (): HighlightPlugin => {
    const store = createStore<StoreProps>({
        selectionState: NoSelectionState,
    });

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

    const handleMouseDown = (textLayerRender: PluginOnTextLayerRender) => (e: MouseEvent) => {
        const pagesRef = store.get('getPagesRef');
        if (!pagesRef || !pagesRef().current) {
            return;
        }
        const pageRect = textLayerRender.ele.getBoundingClientRect();
        const selectionState = store.get('selectionState');
        if (selectionState instanceof SelectedState) {
            const mouseTop = e.clientY - pageRect.top;
            const mouseLeft = e.clientX - pageRect.left;

            // Check if the user clicks inside a highlighting area
            const userClickedInsideArea = selectionState.highlightAreas
                .filter(area => area.pageIndex === textLayerRender.pageIndex)
                .find(area => {
                    const t = area.top * pageRect.height / 100;
                    const l = area.left * pageRect.width / 100;
                    const h = area.height * pageRect.height / 100;
                    const w = area.width * pageRect.width / 100;
                    return (t <= mouseTop) && (mouseTop <= t + h) && (l <= mouseLeft) && (mouseLeft <= l + w);
                });
            if (userClickedInsideArea) {
                // Cancel the selection
                window.getSelection().removeAllRanges();
                store.update('selectionState', NoSelectionState);
            } else {
                store.update('selectionState', SelectingState);
            }
        } else {
            store.update('selectionState', NoSelectionState);
        }
    };

    const onTextLayerRender = (e: PluginOnTextLayerRender) => {
        if (e.status === LayerRenderStatus.DidRender) {
            e.ele.addEventListener('mousedown', handleMouseDown(e));
        }
    };

    return {
        install: (pluginFunctions: PluginFunctions) => {
            store.update('getPagesRef', pluginFunctions.getPagesRef);
        },
        onTextLayerRender,
        renderViewer,
    };
};

export default highlightPlugin;
