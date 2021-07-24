/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { HighlightArea } from './HighlightArea';
import type { SelectionData } from './SelectionData';

export interface RenderHighlightContentProps {
    highlightAreas: HighlightArea[];
    selectedText: string;
    selectionRegion: HighlightArea;
    selectionData: SelectionData;
    cancel(): void;
}
