/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

// Extract a sample of matching text from the page's content
export default interface GetMatchSample {
    keyword: RegExp;
    pageText: string;
    // Position of matching
    startIndex: number;
    endIndex: number;
}
