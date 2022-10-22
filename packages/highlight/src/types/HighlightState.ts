/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { HighlightArea } from './HighlightArea';
import type { SelectionData } from './SelectionData';

export enum HighlightStateType {
    NoSelection,
    Selecting,
    Selected,
    Selection,
    ClickDragged,
}

export const NO_SELECTION_STATE = {
    highlightAreas: [] as HighlightArea[],
    type: HighlightStateType.NoSelection,
};

export const SELECTING_STATE = {
    highlightAreas: [] as HighlightArea[],
    type: HighlightStateType.Selecting,
};

export interface HighlightState {
    type: HighlightStateType;
    highlightAreas: HighlightArea[];
}

export interface SelectedState extends HighlightState {
    selectedText: string;
    selectionData: SelectionData;
    selectionRegion: HighlightArea;
}

export interface SelectionState extends HighlightState {
    selectedText: string;
    selectionData: SelectionData;
    selectionRegion: HighlightArea;
}

export interface ClickDragState extends HighlightState {
    image: string;
    selectionRegion: HighlightArea;
}
