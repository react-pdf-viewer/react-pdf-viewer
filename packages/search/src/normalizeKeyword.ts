/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { EMPTY_KEYWORD_REGEXP } from './constants';
import { type FlagKeyword } from './types/FlagKeyword';
import { type NormalizedKeyword } from './types/NormalizedKeyword';
import { type SingleKeyword } from './types/SingleKeyword';

// `$&` means the whole matched string
const escapeRegExp = (input: string): string => input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const normalizeFlagKeyword = (flagKeyword: FlagKeyword): NormalizedKeyword => {
    const source = flagKeyword.wholeWords ? ` ${flagKeyword.keyword} ` : flagKeyword.keyword;
    const flags = flagKeyword.matchCase ? 'g' : 'gi';
    return {
        keyword: flagKeyword.keyword,
        regExp: new RegExp(escapeRegExp(source), flags),
        wholeWords: flagKeyword.wholeWords || false,
        indexes: flagKeyword.indexes || {},
    };
};

export const normalizeSingleKeyword = (
    keyword: SingleKeyword,
    matchCase?: boolean,
    wholeWords?: boolean,
    indexes?: { [pageIndex: string | number]: number[] },
): NormalizedKeyword => {
    if (keyword instanceof RegExp) {
        return {
            keyword: keyword.source,
            regExp: keyword,
            wholeWords: wholeWords || false,
            indexes: indexes || {},
        };
    }

    // Normalize a string keyword
    if (typeof keyword === 'string') {
        return keyword === ''
            ? EMPTY_KEYWORD_REGEXP
            : normalizeFlagKeyword({
                  keyword,
                  matchCase: matchCase || false,
                  wholeWords: wholeWords || false,
                  indexes,
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
