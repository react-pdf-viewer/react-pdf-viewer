/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

export interface FlagKeyword {
    keyword: string;
    matchCase?: boolean; // `false` by default
    wholeWords?: boolean; // `false` by default
    indexes?: { [pageIndex: string | number]: number[] }; // `{}` by default
}
