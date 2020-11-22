/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { FC, useEffect, useState } from 'react';
import { Store } from '@react-pdf-viewer/core';

import { HighlightState, SelectedState } from './SelectionState';
import StoreProps from './StoreProps';
import HighlightArea from './HighlightArea';

const HighlightAreaList: FC<{
    pageIndex: number,
    store: Store<StoreProps>,
}> = ({ pageIndex, store }) => {
    const [selections, setSelections] = useState<HighlightArea[]>([]);

    const handleSelectionState = (selectionState: SelectedState) => {
        setSelections(selectionState instanceof HighlightState ? selectionState.highlightAreas : []);
    };

    useEffect(() => {
        store.subscribe('selectionState', handleSelectionState);

        return (): void => {
            store.unsubscribe('selectionState', handleSelectionState);
        };
    }, []);

    // Filter the selections
    const listAreas = selections.filter(s => s.pageIndex === pageIndex);

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
