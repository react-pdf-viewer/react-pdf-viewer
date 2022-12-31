/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

export interface MatchPosition {
    // The index of match in the page
    // Each page may have multiple matches
    matchIndex: number;
    pageIndex: number;
}
