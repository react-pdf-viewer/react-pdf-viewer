/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { createStore, LayerRenderStatus, PluginOnTextLayerRender, Plugin, PluginFunctions, PluginRenderPageLayer, RenderViewer, Slot, ViewerState } from '@react-pdf-viewer/core';

import { HIGHLIGHT_LAYER_ATTR, HIGHLIGHT_PAGE_ATTR } from './constants';
import HighlightAreaList from './HighlightAreaList';
import { NO_SELECTION_STATE, SELECTING_STATE, SelectedState } from './SelectionState';
import StoreProps from './StoreProps';
import Tracker from './Tracker';
import HighlightArea from './types/HighlightArea';
import RenderHighlightsProps from './types/RenderHighlightsProps';
import RenderHighlightContentProps from './types/RenderHighlightContentProps';
import RenderHighlightTargetProps from './types/RenderHighlightTargetProps';

export interface HighlightPlugin extends Plugin {
    jumpToHighlightArea(area: HighlightArea): void;
}

export interface HighlightPluginProps {
    renderHighlightTarget?(props: RenderHighlightTargetProps): React.ReactElement;
    renderHighlightContent?(props: RenderHighlightContentProps): React.ReactElement;
    renderHighlights?(props: RenderHighlightsProps): React.ReactElement;
}

const highlightPlugin = (props?: HighlightPluginProps): HighlightPlugin => {
    const store = React.useMemo(() => createStore<StoreProps>({
        selectionState: NO_SELECTION_STATE,
    }), []);

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
        const mouseDownHandler = handleMouseDown(e);
        const textEle = e.ele;

        switch (e.status) {
            case LayerRenderStatus.PreRender:
                textEle.removeEventListener('mousedown', mouseDownHandler);
                break;
            case LayerRenderStatus.DidRender:
                textEle.addEventListener('mousedown', mouseDownHandler);

                // Set some special attributes so we can query the text later
                textEle.setAttribute(HIGHLIGHT_LAYER_ATTR, 'true');
                textEle.querySelectorAll('.rpv-core-text').forEach(span => span.setAttribute(HIGHLIGHT_PAGE_ATTR, `${e.pageIndex}`));
                break;
            default:
                break;
        }
    };

    const renderPageLayer = (renderPageProps: PluginRenderPageLayer) => (
        <HighlightAreaList
            pageIndex={renderPageProps.pageIndex}
            renderHighlightContent={props && props.renderHighlightContent ? props.renderHighlightContent : null}
            renderHighlightTarget={props && props.renderHighlightTarget ? props.renderHighlightTarget : null}
            renderHighlights={props && props.renderHighlights ? props.renderHighlights : null}
            store={store}
        />
    );

    const jumpToHighlightArea = (area: HighlightArea) => {
        const getPagesContainer = store.get('getPagesContainer');
        const getPageElement = store.get('getPageElement');
        if (!getPagesContainer || !getPageElement) {
            return;
        }

        const pagesEle = getPagesContainer();
        if (!pagesEle) {
            return;
        }

        const targetPage = getPageElement(area.pageIndex);
        pagesEle.scrollTop = targetPage.offsetTop + area.top * targetPage.clientHeight / 100 - pagesEle.offsetTop;
    };

    return {
        install: (pluginFunctions: PluginFunctions) => {
            store.update('getPageElement', pluginFunctions.getPageElement);
            store.update('getPagesContainer', pluginFunctions.getPagesContainer);
        },
        onViewerStateChange: (viewerState: ViewerState) => {
            store.update('rotation', viewerState.rotation);
            return viewerState;
        },
        jumpToHighlightArea,
        onTextLayerRender,
        renderPageLayer,
        renderViewer,
    };
};

export default highlightPlugin;
