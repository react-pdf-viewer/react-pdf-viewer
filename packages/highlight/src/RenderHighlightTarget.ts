/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import HighlightArea from './HighlightArea';
import SelectionData from './SelectionData';

interface RenderHighlightTarget {
    highlightAreas: HighlightArea[];
    selectedText: string;
    selectionRegion: HighlightArea;
    selectionData: SelectionData;
    cancel(): void;
    // Switch to the hightlighting state
    toggle(): void;
}

export default RenderHighlightTarget;
