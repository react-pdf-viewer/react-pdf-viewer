/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { PdfJs, Store } from '@react-pdf-viewer/core';

import StoreProps from './StoreProps';
import useDocument from './useDocument';
import useSearch from './useSearch';

interface RenderSearchProps {
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

type RenderSearch = (props: RenderSearchProps) => React.ReactElement;

export interface SearchProps {
    children: RenderSearch;
}

const Inner: React.FC<{
    children: RenderSearch,
    doc: PdfJs.PdfDocument,
    store: Store<StoreProps>,
}> = ({ children, doc, store }) => {
    const result = useSearch(doc, store);
    return children({...result});
};

const Search: React.FC<{
    children: RenderSearch,
    store: Store<StoreProps>
}> = ({ children, store }) => {
    const { currentDoc } = useDocument(store);
    return (
        currentDoc
            ? <Inner doc={currentDoc} store={store}>{children}</Inner>
            : <></>
    );
};

export default Search;
