/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { type HighlightArea } from './HighlightArea';
import { type SelectionData } from './SelectionData';

export enum HighlightStateType {
    NoSelection = 'NoSelection',
    Selecting = 'Selecting',
    Selected = 'Selected',
    Selection = 'Selection',
    ClickDragging = 'ClickDragging',
    ClickDragged = 'ClickDragged',
}

const EMPTY_SELECTION_REGION: HighlightArea = {
    height: 0,
    left: 0,
    pageIndex: -1,
    top: 0,
    width: 0,
};

export const NO_SELECTION_STATE = {
    highlightAreas: [] as HighlightArea[],
    selectionRegion: EMPTY_SELECTION_REGION,
    type: HighlightStateType.NoSelection,
};

export const SELECTING_STATE = {
    highlightAreas: [] as HighlightArea[],
    selectionRegion: EMPTY_SELECTION_REGION,
    type: HighlightStateType.Selecting,
};

export interface HighlightState {
    highlightAreas: HighlightArea[];
    selectionRegion: HighlightArea;
    type: HighlightStateType;
    // For selected and selection states
    selectedText?: string;
    selectionData?: SelectionData;
    // For `ClickDragged` state
    previewImage?: string;
}
