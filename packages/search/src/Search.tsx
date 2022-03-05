/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import type { Store } from '@react-pdf-viewer/core';

import { useSearch } from './useSearch';
import type { Match } from './types/Match';
import type { SearchTargetPageFilter } from './types/SearchTargetPage';
import type { StoreProps } from './types/StoreProps';

export interface RenderSearchProps {
    clearKeyword(): void;
    changeMatchCase(matchCase: boolean): void;
    changeWholeWords(wholeWords: boolean): void;
    currentMatch: number;
    jumpToMatch(matchIndex: number): Match | null;
    jumpToNextMatch(): Match | null;
    jumpToPreviousMatch(): Match | null;
    keyword: string;
    matchCase: boolean;
    numberOfMatches: number;
    wholeWords: boolean;
    search(): Promise<Match[]>;
    setKeyword(keyword: string): void;
    setTargetPages(targetPageFilter: SearchTargetPageFilter): void;
}

type RenderSearch = (props: RenderSearchProps) => React.ReactElement;

export interface SearchProps {
    children: RenderSearch;
}

export const Search: React.FC<{
    children: RenderSearch;
    store: Store<StoreProps>;
}> = ({ children, store }) => {
    const result = useSearch(store);
    return children({ ...result });
};
