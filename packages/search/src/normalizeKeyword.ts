/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { EMPTY_KEYWORD_REGEXP } from './constants';
import type { FlagKeyword } from './types/FlagKeyword';
import type { SingleKeyword } from './types/SingleKeyword';

// `$&` means the whole matched string
const escapeRegExp = (input: string): string => input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const normalizeFlagKeyword = (flagKeyword: FlagKeyword): RegExp => {
    const source = flagKeyword.wholeWords ? ` ${flagKeyword.keyword} ` : flagKeyword.keyword;
    const flags = flagKeyword.matchCase ? 'g' : 'gi';
    return new RegExp(escapeRegExp(source), flags);
};

export const normalizeSingleKeyword = (keyword: SingleKeyword, matchCase?: boolean, wholeWords?: boolean): RegExp => {
    if (keyword instanceof RegExp) {
        return keyword;
    }

    // Normalize a string keyword
    if (typeof keyword === 'string') {
        return keyword === ''
            ? EMPTY_KEYWORD_REGEXP
            : normalizeFlagKeyword({
                  keyword,
                  matchCase: matchCase || false,
                  wholeWords: wholeWords || false,
              });
    }

    // Normalize a keyword with flags
    if (typeof matchCase !== 'undefined') {
        keyword.matchCase = matchCase;
    }
    if (typeof wholeWords !== 'undefined') {
        keyword.wholeWords = wholeWords;
    }
    return normalizeFlagKeyword(keyword);
};
