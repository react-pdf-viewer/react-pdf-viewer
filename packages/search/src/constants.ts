/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { type NormalizedKeyword } from './types/NormalizedKeyword';

// `new RegExp('')` will treat the source as `(?:)` which is not an empty string
export const EMPTY_KEYWORD_REGEXP: NormalizedKeyword = {
    keyword: '',
    regExp: new RegExp(' '),
    wholeWords: false,
};
