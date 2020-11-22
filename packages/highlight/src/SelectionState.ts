/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import HighlightArea from './HighlightArea';
import SelectionData from './SelectionData';

class SelectionState {}

class NoSelectionState extends SelectionState {}

class SelectingState extends SelectionState {}

class SelectedState extends SelectionState {
    public selectedText: string;
    public selectionData: SelectionData;
    public selectionRegion: HighlightArea;
    public highlightAreas: HighlightArea[];

    constructor(
        selectedText: string,
        highlightAreas: HighlightArea[],
        selectionData: SelectionData,
        selectionRegion: HighlightArea
    ) {
        super();
        this.selectedText = selectedText;
        this.selectionData = selectionData;
        this.selectionRegion = selectionRegion;
        this.highlightAreas = highlightAreas;
    }
}

class HighlightState extends SelectionState {
    public selectedText: string;
    public selectionData: SelectionData;
    public selectionRegion: HighlightArea;
    public highlightAreas: HighlightArea[];

    constructor(
        selectedText: string,
        highlightAreas: HighlightArea[],
        selectionData: SelectionData,
        selectionRegion: HighlightArea
    ) {
        super();
        this.selectedText = selectedText;
        this.selectionData = selectionData;
        this.selectionRegion = selectionRegion;
        this.highlightAreas = highlightAreas;
    }
}

export {
    SelectionState,
    NoSelectionState,
    SelectingState,
    SelectedState,
    HighlightState,
};
