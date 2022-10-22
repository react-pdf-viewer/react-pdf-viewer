/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { Store } from '@react-pdf-viewer/core';
import * as React from 'react';
import { HighlightRect } from './HighlightRect';
import { getCssProperties } from './transformArea';
import {
    HighlightState,
    HighlightStateType,
    NO_SELECTION_STATE,
    SelectedState,
    SelectionState,
} from './types/HighlightState';
import type { RenderHighlightContentProps } from './types/RenderHighlightContentProps';
import type { RenderHighlightsProps } from './types/RenderHighlightsProps';
import type { RenderHighlightTargetProps } from './types/RenderHighlightTargetProps';
import type { StoreProps } from './types/StoreProps';
import { useRotation } from './useRotation';

export const HighlightAreaList: React.FC<{
    pageIndex: number;
    renderHighlightContent?(props: RenderHighlightContentProps): React.ReactElement;
    renderHighlightTarget?(props: RenderHighlightTargetProps): React.ReactElement;
    renderHighlights?(props: RenderHighlightsProps): React.ReactElement;
    store: Store<StoreProps>;
}> = ({ pageIndex, renderHighlightContent, renderHighlightTarget, renderHighlights, store }) => {
    const [highlightState, setHighlightState] = React.useState<HighlightState>(store.get('highlightState'));
    const { rotation } = useRotation(store);

    const handleHighlightState = (s: HighlightState) => setHighlightState(s);

    // Cancel the selection
    const cancel = () => {
        window.getSelection().removeAllRanges();
        store.update('highlightState', NO_SELECTION_STATE);
    };

    React.useEffect(() => {
        store.subscribe('highlightState', handleHighlightState);

        return (): void => {
            store.unsubscribe('highlightState', handleHighlightState);
        };
    }, []);

    // Filter the selections
    const listAreas =
        highlightState.type === HighlightStateType.Selection
            ? highlightState.highlightAreas.filter((s) => s.pageIndex === pageIndex)
            : [];

    return (
        <>
            {renderHighlightTarget &&
                highlightState.type === HighlightStateType.Selected &&
                (highlightState as SelectedState).selectionRegion.pageIndex === pageIndex &&
                renderHighlightTarget({
                    highlightAreas: highlightState.highlightAreas,
                    selectedText: (highlightState as SelectedState).selectedText,
                    selectionRegion: (highlightState as SelectedState).selectionRegion,
                    selectionData: (highlightState as SelectedState).selectionData,
                    cancel,
                    toggle: () => {
                        const newState: SelectionState = {
                            type: HighlightStateType.Selection,
                            selectedText: (highlightState as SelectedState).selectedText,
                            highlightAreas: highlightState.highlightAreas,
                            selectionData: (highlightState as SelectedState).selectionData,
                            selectionRegion: (highlightState as SelectedState).selectionRegion,
                        };
                        store.update('highlightState', newState);
                        window.getSelection().removeAllRanges();
                    },
                })}
            {renderHighlightContent &&
                highlightState.type == HighlightStateType.Selection &&
                (highlightState as SelectionState).selectionRegion.pageIndex === pageIndex &&
                renderHighlightContent({
                    highlightAreas: highlightState.highlightAreas,
                    selectedText: (highlightState as SelectionState).selectedText,
                    selectionRegion: (highlightState as SelectionState).selectionRegion,
                    selectionData: (highlightState as SelectionState).selectionData,
                    cancel,
                })}
            {listAreas.length > 0 && (
                <div>
                    {listAreas.map((area, idx) => (
                        <HighlightRect key={idx} area={area} rotation={rotation} />
                    ))}
                </div>
            )}
            {renderHighlights &&
                renderHighlights({
                    pageIndex,
                    rotation,
                    getCssProperties,
                })}
        </>
    );
};
