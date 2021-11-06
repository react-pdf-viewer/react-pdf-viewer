/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import type { Store } from '@react-pdf-viewer/core';

import { getCssProperties } from './transformArea';
import { HighlightRect } from './HighlightRect';
import {
    NO_SELECTION_STATE,
    HighlightAreaState,
    HighlightSelectionState,
    HighlightState,
    SelectedState,
} from './HighlightState';
import { Trigger } from './structs/Trigger';
import { useRotation } from './useRotation';
import type { RenderHighlightContentProps } from './types/RenderHighlightContentProps';
import type { RenderHighlightTargetProps } from './types/RenderHighlightTargetProps';
import type { RenderHighlightsProps } from './types/RenderHighlightsProps';
import type { StoreProps } from './types/StoreProps';

export const HighlightAreaList: React.FC<{
    pageIndex: number;
    renderHighlightContent?(props: RenderHighlightContentProps): React.ReactElement;
    renderHighlightTarget?(props: RenderHighlightTargetProps): React.ReactElement;
    renderHighlights?(props: RenderHighlightsProps): React.ReactElement;
    store: Store<StoreProps>;
    trigger: Trigger;
}> = ({ pageIndex, renderHighlightContent, renderHighlightTarget, renderHighlights, store, trigger }) => {
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
        highlightState instanceof HighlightSelectionState
            ? highlightState.highlightAreas.filter((s) => s.pageIndex === pageIndex)
            : [];

    const highlightAreas = highlightState.highlightAreas;

    return (
        <>
            {renderHighlightTarget &&
                highlightState instanceof SelectedState &&
                highlightState.selectionRegion.pageIndex === pageIndex &&
                renderHighlightTarget({
                    highlightAreas: highlightState.highlightAreas,
                    selectedText: highlightState.selectedText,
                    selectionRegion: highlightState.selectionRegion,
                    selectionData: highlightState.selectionData,
                    cancel,
                    toggle: () => {
                        store.update(
                            'highlightState',
                            new HighlightSelectionState(
                                highlightState.selectedText,
                                highlightState.highlightAreas,
                                highlightState.selectionData,
                                highlightState.selectionRegion
                            )
                        );
                        window.getSelection().removeAllRanges();
                    },
                })}
            {renderHighlightContent &&
                highlightState instanceof HighlightSelectionState &&
                highlightState.selectionRegion.pageIndex === pageIndex &&
                renderHighlightContent({
                    highlightAreas: highlightState.highlightAreas,
                    selectedText: highlightState.selectedText,
                    selectionRegion: highlightState.selectionRegion,
                    selectionData: highlightState.selectionData,
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
                    highlightAreas,
                    pageIndex,
                    rotation,
                    getCssProperties,
                })}
        </>
    );
};
