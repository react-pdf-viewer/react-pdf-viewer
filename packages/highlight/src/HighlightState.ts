/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { HighlightArea } from './types/HighlightArea';
import type { SelectionData } from './types/SelectionData';

export class HighlightState {
    public highlightAreas: HighlightArea[] = [];

    constructor(highlightAreas: HighlightArea[] = []) {
        this.highlightAreas = highlightAreas;
    }
}

class NoSelectionState extends HighlightState {}

class SelectingState extends HighlightState {}

export class SelectedState extends HighlightState {
    public selectedText: string;
    public selectionData: SelectionData;
    public selectionRegion: HighlightArea;

    constructor(
        selectedText: string,
        highlightAreas: HighlightArea[],
        selectionData: SelectionData,
        selectionRegion: HighlightArea
    ) {
        super(highlightAreas);
        this.selectedText = selectedText;
        this.selectionData = selectionData;
        this.selectionRegion = selectionRegion;
    }
}

export class HighlightSelectionState extends HighlightState {
    public selectedText: string;
    public selectionData: SelectionData;
    public selectionRegion: HighlightArea;

    constructor(
        selectedText: string,
        highlightAreas: HighlightArea[],
        selectionData: SelectionData,
        selectionRegion: HighlightArea
    ) {
        super(highlightAreas);
        this.selectedText = selectedText;
        this.selectionData = selectionData;
        this.selectionRegion = selectionRegion;
    }
}

// Create some instances
export const NO_SELECTION_STATE = new NoSelectionState();
export const SELECTING_STATE = new SelectingState();
