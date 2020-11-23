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
import { HighlightState, NoSelectionState, SelectedState, SelectionState } from './SelectionState';
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
        store.update('selectionState', new NoSelectionState());
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
                    },
                })
            )
        }
        {
           listAreas.map((area, idx) => (
                <svg
                    key={idx}
                    style={{
                        position: 'absolute',
                        transform: `translate(${area.left}%, ${area.top}%)`,
                    }}
                    height={`${area.height}%`}
                    width={`${area.width}%`}
                >
                    <rect
                        height='100%'
                        width='100%'
                        fill='yellow'
                        fillOpacity='0.4'
                    />
                </svg>
            ))
        }
        </>
    );
};

export default HighlightAreaList;
