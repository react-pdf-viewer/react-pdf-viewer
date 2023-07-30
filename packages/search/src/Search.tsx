/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { type PdfJs, type Store } from '@react-pdf-viewer/core';
import * as React from 'react';
import { type Match } from './types/Match';
import { type SearchTargetPageFilter } from './types/SearchTargetPage';
import { type StoreProps } from './types/StoreProps';
import { useSearch } from './useSearch';

export interface RenderSearchProps {
    clearKeyword(): void;
    changeMatchCase(matchCase: boolean): void;
    changeWholeWords(wholeWords: boolean): void;
    currentMatch: number;
    isDocumentLoaded: boolean;
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

    const [isDocumentLoaded, setDocumentLoaded] = React.useState(false);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleDocumentChanged = (_: PdfJs.PdfDocument) => setDocumentLoaded(true);

    React.useEffect(() => {
        store.subscribe('doc', handleDocumentChanged);
        return () => {
            store.unsubscribe('doc', handleDocumentChanged);
        };
    }, []);

    return children({ ...result, isDocumentLoaded });
};
