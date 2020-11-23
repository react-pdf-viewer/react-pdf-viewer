/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { FC, ReactElement, useEffect, useState } from 'react';
import { Store } from '@react-pdf-viewer/core';

import RenderHighlightTargetProps from './RenderHighlightTargetProps';
import { NO_SELECTION_STATE, HighlightState, SelectedState, SelectionState } from './SelectionState';
import StoreProps from './StoreProps';

const HighlightAreaList: FC<{
    pageIndex: number,
    renderHighlightTarget?(props: RenderHighlightTargetProps): ReactElement,
    store: Store<StoreProps>,
}> = ({ pageIndex, renderHighlightTarget, store }) => {
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
    let listAreas = selectionState instanceof HighlightState
        ? selectionState.highlightAreas.filter(s => s.pageIndex === pageIndex + 1)
        : [];

    return (
        <>
        {
            renderHighlightTarget && (selectionState instanceof SelectedState) && (selectionState.selectionRegion.pageIndex === pageIndex + 1) && (
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
        <div>
        {
           listAreas.map((area, idx) => (
                <svg
                    key={idx}
                    style={{
                        position: 'absolute',
                        top: `${area.top}%`,
                        left: `${area.left}%`,
                    }}
                    height={`${area.height}%`}
                    width={`${area.width}%`}
                >
                    <rect className='rpv-highlight-highlighting-rect' />
                </svg>
            ))
        }
        </div>
        </>
    );
};

export default HighlightAreaList;
