/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

export interface VisiblePagesRange {
    endPage: number;
    numPages: number;
    startPage: number;
}

export type SetRenderRange = (visiblePagesRange: VisiblePagesRange) => { endPage: number; startPage: number };
