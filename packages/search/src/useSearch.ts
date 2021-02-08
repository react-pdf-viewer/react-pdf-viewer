/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { PdfJs, Store } from '@react-pdf-viewer/core';

import { EMPTY_KEYWORD_REGEXP } from './constants';
import Match from './types/Match';
import StoreProps from './types/StoreProps';

interface UseSearch {
    clearKeyword(): void;
    changeMatchCase(matchCase: boolean): void;
    changeWholeWords(wholeWords: boolean): void;
    currentMatch: number;
    jumpToNextMatch(): void;
    jumpToPreviousMatch(): void;
    keyword: string;
    matchCase: boolean;
    numberOfMatches: number;
    wholeWords: boolean;
    search(): void;
    setKeyword(keyword: string): void;
}

const useSearch = (
    doc: PdfJs.PdfDocument,
    store: Store<StoreProps>
): UseSearch => {
    const [keyword, setKeyword] = React.useState('');
    const [found, setFound] = React.useState<Match[]>([]);
    const [currentMatch, setCurrentMatch] = React.useState(0);
    const [matchCase, setMatchCase] = React.useState(false);
    const textContents = React.useRef<string[]>([]);
    const [wholeWords, setWholeWords] = React.useState(false);
    const indexArr = Array(doc.numPages)
        .fill(0)
        .map((_, i) => i);

    const changeMatchCase = (isChecked: boolean): void => {
        setMatchCase(isChecked);
        if (keyword) {
            searchFor(keyword, isChecked, wholeWords);
        }
    };

    const changeWholeWords = (isChecked: boolean): void => {
        setWholeWords(isChecked);
        if (keyword) {
            searchFor(keyword, matchCase, isChecked);
        }
    };

    const jumpToPreviousMatch = (): void => {
        if (!keyword) {
            return;
        }
        const prev = currentMatch - 1;
        const updated = prev > 0 ? prev : found.length;
        setCurrentMatch(updated);
        jumpToMatch(found[updated - 1]);
    };

    const jumpToNextMatch = (): void => {
        if (!keyword) {
            return;
        }
        const next = currentMatch + 1;
        const updated = next <= found.length ? next : 1;
        setCurrentMatch(updated);
        jumpToMatch(found[updated - 1]);
    };

    const clearKeyword = (): void => {
        if (!keyword) {
            // Do nothing
            return;
        }
        store.update('keyword', [EMPTY_KEYWORD_REGEXP]);

        setKeyword('');
        setCurrentMatch(0);
        setFound([]);
        setMatchCase(false);
        setWholeWords(false);
    };

    const search = () => searchFor(keyword, matchCase, wholeWords);

    // Private
    // -------

    const buildKeywordRegex = (
        keywordParam: string,
        matchCaseParam: boolean,
        wholeWordsParam: boolean
    ): RegExp => {
        const source = wholeWordsParam ? ` ${keywordParam} ` : keywordParam;
        const flags = matchCaseParam ? 'g' : 'gi';
        return new RegExp(source, flags);
    };

    const getTextContents = (): Promise<string[]> => {
        const promises = indexArr.map((pageIndex) => {
            return doc
                .getPage(pageIndex + 1)
                .then((page) => {
                    return page.getTextContent();
                })
                .then((content) => {
                    const pageContent = content.items
                        .map((item) => item.str || '')
                        .join('');
                    return Promise.resolve({
                        pageContent,
                        pageIndex,
                    });
                });
        });
        return Promise.all(promises).then((data) => {
            data.sort((a, b) => a.pageIndex - b.pageIndex);
            return Promise.resolve(data.map((item) => item.pageContent));
        });
    };

    const jumpToMatch = (match: Match) => {
        const jumpToPage = store.get('jumpToPage');
        if (jumpToPage) {
            jumpToPage(match.pageIndex);
        }
        store.update('match', match);
    };

    const searchFor = (
        keywordParam: string,
        matchCaseParam: boolean,
        wholeWordsParam: boolean
    ): void => {
        const regexp = buildKeywordRegex(
            keywordParam,
            matchCaseParam,
            wholeWordsParam
        );
        store.update('keyword', [regexp]);

        setCurrentMatch(0);
        setFound([]);

        const promise =
            textContents.current.length === 0
                ? getTextContents().then((response) => {
                      textContents.current = response;
                      return Promise.resolve(response);
                  })
                : Promise.resolve(textContents.current);

        promise.then((response) => {
            const arr: Match[] = [];
            response.forEach((item, pageIndex) => {
                const numMatches = (item.match(regexp) || []).length;
                for (
                    let matchIndex = 0;
                    matchIndex < numMatches;
                    matchIndex++
                ) {
                    arr.push({
                        matchIndex,
                        pageIndex,
                    });
                }
            });
            setFound(arr);
            if (arr.length > 0) {
                setCurrentMatch(1);
                jumpToMatch(arr[0]);
            }
        });
    };

    return {
        clearKeyword,
        changeMatchCase,
        changeWholeWords,
        currentMatch,
        jumpToNextMatch,
        jumpToPreviousMatch,
        keyword,
        matchCase,
        numberOfMatches: found.length,
        wholeWords,
        search,
        setKeyword,
    };
};

export default useSearch;
