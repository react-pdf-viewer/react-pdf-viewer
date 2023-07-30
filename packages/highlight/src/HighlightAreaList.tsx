/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { type Store } from '@react-pdf-viewer/core';
import * as React from 'react';
import { HighlightRect } from './HighlightRect';
import { getCssProperties } from './transformArea';
import { HighlightState, HighlightStateType, NO_SELECTION_STATE } from './types/HighlightState';
import { type RenderHighlightContentProps } from './types/RenderHighlightContentProps';
import { type RenderHighlightTargetProps } from './types/RenderHighlightTargetProps';
import { type RenderHighlightsProps } from './types/RenderHighlightsProps';
import { type StoreProps } from './types/StoreProps';
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
                (highlightState.type === HighlightStateType.Selected ||
                    highlightState.type === HighlightStateType.ClickDragged) &&
                highlightState.selectionRegion.pageIndex === pageIndex &&
                renderHighlightTarget({
                    highlightAreas: highlightState.highlightAreas,
                    previewImage: highlightState.previewImage || '',
                    selectedText: highlightState.selectedText || '',
                    selectionRegion: highlightState.selectionRegion,
                    selectionData: highlightState.selectionData,
                    cancel,
                    toggle: () => {
                        // Switch to the `Selection` state
                        const newState = Object.assign({}, highlightState, {
                            type: HighlightStateType.Selection,
                        });
                        store.update('highlightState', newState);
                        window.getSelection().removeAllRanges();
                    },
                })}
            {renderHighlightContent &&
                highlightState.type == HighlightStateType.Selection &&
                highlightState.selectionRegion.pageIndex === pageIndex &&
                renderHighlightContent({
                    highlightAreas: highlightState.highlightAreas,
                    previewImage: highlightState.previewImage || '',
                    selectedText: highlightState.selectedText || '',
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
                    pageIndex,
                    rotation,
                    getCssProperties,
                })}
        </>
    );
};
