/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import HighlightArea from './HighlightArea';

class SelectionState {}

class NoSelectionState extends SelectionState {}

class SelectingState extends SelectionState {}

class SelectedState extends SelectionState {
    public selectedText: string;
    public highlightAreas: HighlightArea[];

    constructor(selectedText: string, highlightAreas: HighlightArea[]) {
        super();
        this.selectedText = selectedText;
        this.highlightAreas = highlightAreas;
    }
}

class HighlightState extends SelectionState {
    public selectedText: string;
    public highlightAreas: HighlightArea[];

    constructor(selectedText: string, highlightAreas: HighlightArea[]) {
        super();
        this.selectedText = selectedText;
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
