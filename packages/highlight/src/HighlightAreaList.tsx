/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { FC, ReactElement, useEffect, useState } from 'react';
import { Store } from '@react-pdf-viewer/core';

import HighlightRect from './HighlightRect';
import { NO_SELECTION_STATE, HighlightState, SelectedState, SelectionState } from './SelectionState';
import StoreProps from './StoreProps';
import RenderHighlightContentProps from './types/RenderHighlightContentProps';
import RenderHighlightTargetProps from './types/RenderHighlightTargetProps';
import RenderHighlightsProps from './types/RenderHighlightsProps';

const HighlightAreaList: FC<{
    pageIndex: number,
    renderHighlightContent?(props: RenderHighlightContentProps): ReactElement,
    renderHighlightTarget?(props: RenderHighlightTargetProps): ReactElement,
    renderHighlights?(props: RenderHighlightsProps): ReactElement,
    store: Store<StoreProps>,
}> = ({ pageIndex, renderHighlightContent, renderHighlightTarget, renderHighlights, store }) => {
    const [selectionState, setSelectionState] = useState<SelectionState>(store.get('selectionState'));

    const handleSelectionState = (s: SelectionState) => setSelectionState(s);

    // Cancel the selection
    const cancel = () => {
        window.getSelection().removeAllRanges();
        store.update('selectionState', NO_SELECTION_STATE);
    };

    useEffect(() => {
        store.subscribe('selectionState', handleSelectionState);

        return (): void => {
            store.unsubscribe('selectionState', handleSelectionState);
        };
    }, []);

    // Filter the selections
    const listAreas = selectionState instanceof HighlightState
        ? selectionState.highlightAreas.filter(s => s.pageIndex === pageIndex)
        : [];

    return (
        <>
        {
            renderHighlightTarget && (selectionState instanceof SelectedState) && (selectionState.selectionRegion.pageIndex === pageIndex) && (
                renderHighlightTarget({
                    highlightAreas: selectionState.highlightAreas,
                    selectedText: selectionState.selectedText,
                    selectionRegion: selectionState.selectionRegion,
                    selectionData: selectionState.selectionData,
                    cancel,
                    toggle: () => {
                        store.update('selectionState', new HighlightState(
                            selectionState.selectedText,
                            selectionState.highlightAreas,
                            selectionState.selectionData,
                            selectionState.selectionRegion
                        ));
                        window.getSelection().removeAllRanges();
                    },
                })
            )
        }
        {
            renderHighlightContent && (selectionState instanceof HighlightState) && (selectionState.selectionRegion.pageIndex === pageIndex) && (
                renderHighlightContent({
                    highlightAreas: selectionState.highlightAreas,
                    selectedText: selectionState.selectedText,
                    selectionRegion: selectionState.selectionRegion,
                    selectionData: selectionState.selectionData,
                    cancel,
                })
            )
        }
        <div>
        {
           listAreas.map((area, idx) => <HighlightRect key={idx} area={area} />)
        }
        </div>
        {
            renderHighlights && renderHighlights({ pageIndex })
        }
        </>
    );
};

export default HighlightAreaList;
