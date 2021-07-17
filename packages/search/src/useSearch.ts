/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Store } from '@react-pdf-viewer/core';

import { EMPTY_KEYWORD_REGEXP } from './constants';
import { normalizeSingleKeyword } from './normalizeKeyword';
import GetMatchSample from './types/GetMatchSample';
import Match from './types/Match';
import Result from './types/Result';
import SingleKeyword from './types/SingleKeyword';
import StoreProps from './types/StoreProps';
import useDocument from './useDocument';

interface UseSearch {
    clearKeyword(): void;
    changeMatchCase(matchCase: boolean): void;
    changeWholeWords(wholeWords: boolean): void;
    currentMatch: number;
    jumpToNextMatch(): void;
    jumpToPreviousMatch(): void;
    keywords: SingleKeyword[];
    matchCase: boolean;
    numberOfMatches: number;
    wholeWords: boolean;
    search(): Promise<Result[]>;
    setKeywords(keyword: SingleKeyword[]): void;
    searchFor(keyword: SingleKeyword[], matchCase?: boolean, wholeWords?: boolean): Promise<Result[]>;
    // Compatible with the single keyword search
    keyword: string;
    setKeyword(keyword: string): void;
}

const useSearch = (store: Store<StoreProps>, getMatchSample?: (props: GetMatchSample) => string): UseSearch => {
    const { currentDoc } = useDocument(store);
    const [keywords, setKeywords] = React.useState<SingleKeyword[]>([]);
    const [found, setFound] = React.useState<Result[]>([]);
    const [currentMatch, setCurrentMatch] = React.useState(0);
    const [matchCase, setMatchCase] = React.useState(false);
    const textContents = React.useRef<string[]>([]);
    const [wholeWords, setWholeWords] = React.useState(false);
    const matchSample = React.useCallback(getMatchSample || ((props: GetMatchSample) => props.keyword.source), [
        getMatchSample,
    ]);

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

    const jumpToPreviousMatch = (): void => {
        if (keywords.length === 0 || found.length === 0) {
            return;
        }
        const prev = currentMatch - 1;
        const updated = prev > 0 ? prev : found.length;
        setCurrentMatch(updated);
        jumpToMatch(found[updated - 1]);
    };

    const jumpToNextMatch = (): void => {
        if (keywords.length === 0 || found.length === 0) {
            return;
        }
        const next = currentMatch + 1;
        const updated = next <= found.length ? next : 1;
        setCurrentMatch(updated);
        jumpToMatch(found[updated - 1]);
    };

    const clearKeyword = (): void => {
        if (keywords.length === 0) {
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

    const search = () => searchFor(keywords, matchCase, wholeWords);

    const setKeyword = (keyword: string) => setKeywords(keyword === '' ? [] : [keyword]);

    // Private
    // -------

    const getTextContents = (): Promise<string[]> => {
        if (!currentDoc) {
            return Promise.resolve([]);
        }

        const promises = Array(currentDoc.numPages)
            .fill(0)
            .map((_, pageIndex) => {
                return currentDoc
                    .getPage(pageIndex + 1)
                    .then((page) => {
                        return page.getTextContent();
                    })
                    .then((content) => {
                        const pageContent = content.items.map((item) => item.str || '').join('');
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
    ): Promise<Result[]> => {
        const keywords = keywordParam.map((k) => normalizeSingleKeyword(k, matchCaseParam, wholeWordsParam));
        store.update('keyword', keywords);

        setCurrentMatch(0);
        setFound([]);

        return new Promise((resolve, _) => {
            const getTextPromise =
                textContents.current.length === 0
                    ? getTextContents().then((response) => {
                          textContents.current = response;
                          return Promise.resolve(response);
                      })
                    : Promise.resolve(textContents.current);

            getTextPromise.then((response) => {
                const arr: Result[] = [];
                response.forEach((item, pageIndex) => {
                    keywords.forEach((keyword) => {
                        let matchIndex = -1;
                        let matches: RegExpExecArray | null;
                        while ((matches = keyword.exec(item)) !== null) {
                            matchIndex++;
                            arr.push({
                                keyword,
                                matchIndex,
                                matchSample: matchSample({
                                    keyword,
                                    pageText: item,
                                    startIndex: matches.index,
                                    endIndex: keyword.lastIndex,
                                }),
                                pageIndex,
                            });
                        }
                    });
                });
                setFound(arr);
                if (arr.length > 0) {
                    setCurrentMatch(1);
                    jumpToMatch({
                        matchIndex: arr[0].matchIndex,
                        pageIndex: arr[0].pageIndex,
                    });
                }

                resolve(arr);
            });
        });
    };

    React.useEffect(() => {
        // Reset the text contents when the document changes
        textContents.current = [];
    }, [currentDoc]);

    return {
        clearKeyword,
        changeMatchCase,
        changeWholeWords,
        currentMatch,
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
    };
};

export default useSearch;
