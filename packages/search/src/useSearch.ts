/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { Store } from '@react-pdf-viewer/core';
import { getPage } from '@react-pdf-viewer/core';
import * as React from 'react';
import { EMPTY_KEYWORD_REGEXP } from './constants';
import { normalizeSingleKeyword } from './normalizeKeyword';
import type { Match } from './types/Match';
import type { SearchTargetPageFilter } from './types/SearchTargetPage';
import type { SingleKeyword } from './types/SingleKeyword';
import type { StoreProps } from './types/StoreProps';
import { useDocument } from './useDocument';

export const useSearch = (
    store: Store<StoreProps>
): {
    clearKeyword(): void;
    changeMatchCase(matchCase: boolean): void;
    changeWholeWords(wholeWords: boolean): void;
    currentMatch: number;
    jumpToMatch(index: number): Match | null;
    jumpToNextMatch(): Match | null;
    jumpToPreviousMatch(): Match | null;
    keywords: SingleKeyword[];
    matchCase: boolean;
    numberOfMatches: number;
    wholeWords: boolean;
    search(): Promise<Match[]>;
    setKeywords(keyword: SingleKeyword[]): void;
    searchFor(keyword: SingleKeyword[], matchCase?: boolean, wholeWords?: boolean): Promise<Match[]>;
    setTargetPages(targetPageFilter: SearchTargetPageFilter): void;
    // Compatible with the single keyword search
    keyword: string;
    setKeyword(keyword: string): void;
} => {
    const initialKeyword = store.get('initialKeyword');

    const normalizedKeywordFlags = React.useMemo(() => {
        if (initialKeyword && initialKeyword.length === 1) {
            const normalizedKeyword = normalizeSingleKeyword(initialKeyword[0]);
            return {
                matchCase: normalizedKeyword.regExp.flags.indexOf('i') === -1,
                wholeWords: normalizedKeyword.wholeWords,
            };
        } else {
            return {
                matchCase: false,
                wholeWords: false,
            };
        }
    }, []);

    const currentDocRef = useDocument(store);
    const [keywords, setKeywords] = React.useState<SingleKeyword[]>(initialKeyword);
    const [found, setFound] = React.useState<Match[]>([]);
    const [currentMatch, setCurrentMatch] = React.useState(0);
    const [matchCase, setMatchCase] = React.useState(normalizedKeywordFlags.matchCase);
    const textContents = React.useRef<string[]>([]);
    const [wholeWords, setWholeWords] = React.useState(normalizedKeywordFlags.wholeWords);

    const defaultTargetPageFilter = () => true;
    const targetPageFilter = React.useCallback(
        () => store.get('targetPageFilter') || defaultTargetPageFilter,
        [store.get('targetPageFilter')]
    );

    const changeMatchCase = (isChecked: boolean): void => {
        setMatchCase(isChecked);
        if (keywords.length > 0) {
            searchFor(keywords, isChecked, wholeWords);
        }
    };

    const changeWholeWords = (isChecked: boolean): void => {
        setWholeWords(isChecked);
        if (keywords.length > 0) {
            searchFor(keywords, matchCase, isChecked);
        }
    };

    const jumpToMatch = (index: number): Match | null => {
        const numMatches = found.length;
        if (keywords.length === 0 || numMatches === 0) {
            return null;
        }

        // Make sure that the `index` is in the range of 1 and `numMatches`
        const normalizedIndex = index === numMatches + 1 ? 1 : Math.max(1, Math.min(numMatches, index));
        setCurrentMatch(normalizedIndex);
        return jumpToGivenMatch(found[normalizedIndex - 1]);
    };

    const jumpToPreviousMatch = (): Match | null => jumpToMatch(currentMatch - 1);

    const jumpToNextMatch = (): Match | null => jumpToMatch(currentMatch + 1);

    const clearKeyword = (): void => {
        store.update('keyword', [EMPTY_KEYWORD_REGEXP]);

        setKeyword('');
        setCurrentMatch(0);
        setFound([]);
        setMatchCase(false);
        setWholeWords(false);
    };

    const search = () => searchFor(keywords, matchCase, wholeWords);

    const setKeyword = (keyword: string) => setKeywords(keyword === '' ? [] : [keyword]);

    const setTargetPages = (targetPageFilter: SearchTargetPageFilter) => {
        store.update('targetPageFilter', targetPageFilter);
    };

    // Private
    // -------

    const getTextContents = (): Promise<string[]> => {
        const currentDoc = currentDocRef.current;
        if (!currentDoc) {
            return Promise.resolve([]);
        }

        const promises = Array(currentDoc.numPages)
            .fill(0)
            .map((_, pageIndex) =>
                getPage(currentDoc, pageIndex)
                    .then((page) => {
                        return page.getTextContent();
                    })
                    .then((content) => {
                        const pageContent = content.items.map((item) => item.str || '').join('');
                        return Promise.resolve({
                            pageContent,
                            pageIndex,
                        });
                    })
            );
        return Promise.all(promises).then((data) => {
            data.sort((a, b) => a.pageIndex - b.pageIndex);
            return Promise.resolve(data.map((item) => item.pageContent));
        });
    };

    const jumpToGivenMatch = (match: Match): Match => {
        const jumpToPage = store.get('jumpToPage');
        if (jumpToPage) {
            jumpToPage(match.pageIndex);
        }
        store.update('matchPosition', {
            matchIndex: match.matchIndex,
            pageIndex: match.pageIndex,
        });
        return match;
    };

    const getKeywordSource = (keyword: SingleKeyword): string => {
        if (keyword instanceof RegExp) {
            return keyword.source;
        }
        if (typeof keyword === 'string') {
            return keyword;
        }
        return keyword.keyword;
    };

    const searchFor = (
        keywordParam: SingleKeyword[],
        matchCaseParam?: boolean,
        wholeWordsParam?: boolean
    ): Promise<Match[]> => {
        const currentDoc = currentDocRef.current;
        if (!currentDoc) {
            return Promise.resolve([]);
        }

        const numPages = currentDoc.numPages;
        const keywords = keywordParam.map((k) => normalizeSingleKeyword(k, matchCaseParam, wholeWordsParam));
        store.update('keyword', keywords);

        setCurrentMatch(0);
        setFound([]);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return new Promise((resolve, _) => {
            const getTextPromise =
                textContents.current.length === 0
                    ? getTextContents().then((response) => {
                          textContents.current = response;
                          return Promise.resolve(response);
                      })
                    : Promise.resolve(textContents.current);

            getTextPromise.then((response) => {
                const arr: Match[] = [];
                response.forEach((pageText, pageIndex) => {
                    if (targetPageFilter()({ pageIndex, numPages })) {
                        keywords.forEach((keyword) => {
                            let matchIndex = 0;
                            let matches: RegExpExecArray | null;
                            while ((matches = keyword.regExp.exec(pageText)) !== null) {
                                arr.push({
                                    keyword: keyword.regExp,
                                    matchIndex,
                                    pageIndex,
                                    pageText,
                                    startIndex: matches.index,
                                    endIndex: keyword.regExp.lastIndex,
                                });
                                matchIndex++;
                            }
                        });
                    }
                });
                setFound(arr);
                if (arr.length > 0) {
                    setCurrentMatch(1);
                    jumpToGivenMatch(arr[0]);
                }

                resolve(arr);
            });
        });
    };

    React.useEffect(() => {
        // Reset the text contents when the document changes
        textContents.current = [];
    }, [currentDocRef.current]);

    return {
        clearKeyword,
        changeMatchCase,
        changeWholeWords,
        currentMatch,
        jumpToMatch,
        jumpToNextMatch,
        jumpToPreviousMatch,
        keywords,
        matchCase,
        numberOfMatches: found.length,
        wholeWords,
        search,
        searchFor,
        setKeywords,
        // Compatible with the single keyword search
        keyword: keywords.length === 0 ? '' : getKeywordSource(keywords[0]),
        setKeyword,
        setTargetPages,
    };
};
