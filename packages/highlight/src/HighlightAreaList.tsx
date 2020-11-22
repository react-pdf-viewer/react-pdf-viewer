/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { FC, useEffect, useState } from 'react';
import { Store } from '@react-pdf-viewer/core';

import { HighlightState, SelectedState, SelectionState } from './SelectionState';
import StoreProps from './StoreProps';
import HighlightArea from './HighlightArea';

const HighlightAreaList: FC<{
    pageIndex: number,
    store: Store<StoreProps>,
}> = ({ pageIndex, store }) => {
    const [selectionState, setSelectionState] = useState<SelectionState>(store.get('selectionState'));

    const handleSelectionState = (s: SelectionState) => setSelectionState(s);

    useEffect(() => {
        store.subscribe('selectionState', handleSelectionState);

        return (): void => {
            store.unsubscribe('selectionState', handleSelectionState);
        };
    }, []);

    // Filter the selections
    let listAreas = selectionState instanceof HighlightState
        ? selectionState.highlightAreas.filter(s => s.pageIndex === pageIndex)
        : [];

    return (
        <>
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
