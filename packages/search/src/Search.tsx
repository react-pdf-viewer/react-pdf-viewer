/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import type { Store } from '@react-pdf-viewer/core/lib';

import Match from './types/Match';
import StoreProps from './types/StoreProps';
import useSearch from './useSearch';

interface RenderSearchProps {
    clearKeyword(): void;
    changeMatchCase(matchCase: boolean): void;
    changeWholeWords(wholeWords: boolean): void;
    currentMatch: number;
    jumpToMatch(matchIndex: number, pageIndex: number): Match | null;
    jumpToNextMatch(): Match | null;
    jumpToPreviousMatch(): Match | null;
    keyword: string;
    matchCase: boolean;
    numberOfMatches: number;
    wholeWords: boolean;
    search(): Promise<Match[]>;
    setKeyword(keyword: string): void;
}

type RenderSearch = (props: RenderSearchProps) => React.ReactElement;

export interface SearchProps {
    children: RenderSearch;
}

const Search: React.FC<{
    children: RenderSearch;
    store: Store<StoreProps>;
}> = ({ children, store }) => {
    const result = useSearch(store);
    return children({ ...result });
};

export default Search;
