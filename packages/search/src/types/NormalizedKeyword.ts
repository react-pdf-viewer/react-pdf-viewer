/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

export interface NormalizedKeyword {
    keyword: string;
    regExp: RegExp;
    wholeWords: boolean;
    indexes: { [pageIndex: string | number]: number[] };
}
