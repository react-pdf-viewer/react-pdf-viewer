/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

export default interface Result {
    keyword: RegExp;
    // The index of match in the page
    // Each page may have multiple matches
    matchIndex: number;
    // A sample of matching text that is extracted from the page's content
    // It's useful when we want to display the sample text in the front-end
    matchSample: string;
    pageIndex: number;
}
