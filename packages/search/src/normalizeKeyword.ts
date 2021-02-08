/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { EMPTY_KEYWORD_REGEXP } from './constants'; 
import FlagKeyword from "./types/FlagKeyword";
import SingleKeyword from "./types/SingleKeyword";

const normalizeFlagKeyword = (flagKeyword: FlagKeyword): RegExp => {
    const source = flagKeyword.wholeWords ? ` ${flagKeyword.keyword} ` : flagKeyword.keyword;
    const flags = flagKeyword.matchCase ? 'g' : 'gi';
    return new RegExp(source, flags);
};

const normalizeSingleKeyword = (keyword: SingleKeyword): RegExp => {
    if (keyword instanceof RegExp) {
        return keyword;
    }
    if (typeof keyword === 'string') {
        return keyword === '' ? EMPTY_KEYWORD_REGEXP : new RegExp(keyword);
    }
    return normalizeFlagKeyword(keyword);
};

export { normalizeFlagKeyword, normalizeSingleKeyword };
