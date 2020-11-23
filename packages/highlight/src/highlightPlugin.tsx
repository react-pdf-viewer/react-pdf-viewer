/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { ReactElement } from 'react';
import { createStore, LayerRenderStatus, PluginOnTextLayerRender, Plugin, PluginFunctions, PluginRenderPageLayer, RenderViewer, Slot } from '@react-pdf-viewer/core';

import HighlightAreaList from './HighlightAreaList';
import RenderHighlightTargetProps from './RenderHighlightTargetProps';
import { NO_SELECTION_STATE, SELECTING_STATE, SelectedState } from './SelectionState';
import StoreProps from './StoreProps';
import Tracker from './Tracker';

interface HighlightPlugin extends Plugin {
}

export interface HighlightPluginProps {
    renderHighlightTarget(props: RenderHighlightTargetProps): ReactElement;
}

const highlightPlugin = (props?: HighlightPluginProps): HighlightPlugin => {
    const store = createStore<StoreProps>({
        selectionState: NO_SELECTION_STATE,
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
                store.update('selectionState', NO_SELECTION_STATE);
            } else {
                store.update('selectionState', SELECTING_STATE);
            }
        } else {
            store.update('selectionState', NO_SELECTION_STATE);
        }
    };

    const onTextLayerRender = (e: PluginOnTextLayerRender) => {
        if (e.status === LayerRenderStatus.DidRender) {
            e.ele.addEventListener('mousedown', handleMouseDown(e));

            // Set some special attributes so we can query the text later
            e.ele.setAttribute('data-layer', 'text');
            e.ele.querySelectorAll('.rpv-core-text').forEach(span => span.setAttribute('data-text-page', `${e.pageIndex + 1}`));
        }
    };

    const renderPageLayer = (renderPageProps: PluginRenderPageLayer) => (
        <HighlightAreaList
            pageIndex={renderPageProps.pageIndex}
            renderHighlightTarget={props ? props.renderHighlightTarget : null}
            store={store}
        />
    );

    return {
        install: (pluginFunctions: PluginFunctions) => {
            store.update('getPagesRef', pluginFunctions.getPagesRef);
        },
        onTextLayerRender,
        renderPageLayer,
        renderViewer,
    };
};

export default highlightPlugin;
