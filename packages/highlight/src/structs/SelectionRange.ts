/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

export enum SelectionRange {
    // User selects text from the same div
    SameDiv = 'SameDiv',
    // User selects text from different divs in a single page
    DifferentDivs = 'DifferentDivs',
    // User selects text in multiple pages
    DifferentPages = 'DifferentPages',
}
