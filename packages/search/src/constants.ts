/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { NormalizedKeyword } from './types/NormalizedKeyword';

// `new RegExp('')` will treat the source as `(?:)` which is not an empty string
export const EMPTY_KEYWORD_REGEXP: NormalizedKeyword = {
    keyword: '',
    regExp: new RegExp(' '),
    wholeWords: false,
};
