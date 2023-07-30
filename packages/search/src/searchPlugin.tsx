/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import {
    createStore,
    type Plugin,
    type PluginFunctions,
    type PluginOnDocumentLoad,
    type PluginOnTextLayerRender,
    type PluginRenderPageLayer,
    type RenderViewer,
    type Slot,
} from '@react-pdf-viewer/core';
import * as React from 'react';
import { Highlights } from './Highlights';
import { Search, SearchProps } from './Search';
import { ShortcutHandler } from './ShortcutHandler';
import { ShowSearchPopover, ShowSearchPopoverProps } from './ShowSearchPopover';
import { ShowSearchPopoverButton } from './ShowSearchPopoverButton';
import { EMPTY_KEYWORD_REGEXP } from './constants';
import { normalizeSingleKeyword } from './normalizeKeyword';
import { type Match } from './types/Match';
import { type NormalizedKeyword } from './types/NormalizedKeyword';
import { type OnHighlightKeyword } from './types/OnHighlightKeyword';
import { type RenderHighlightsProps } from './types/RenderHighlightsProps';
import { type SearchTargetPageFilter } from './types/SearchTargetPage';
import { type SingleKeyword } from './types/SingleKeyword';
import { type StoreProps } from './types/StoreProps';
import { useSearch } from './useSearch';

export interface SearchPlugin extends Plugin {
    Search(props: SearchProps): React.ReactElement;
    ShowSearchPopover(props: ShowSearchPopoverProps): React.ReactElement;
    ShowSearchPopoverButton(): React.ReactElement;
    clearHighlights(): void;
    highlight(keyword: SingleKeyword | SingleKeyword[]): Promise<Match[]>;
    jumpToMatch(index: number): Match | null;
    jumpToNextMatch(): Match | null;
    jumpToPreviousMatch(): Match | null;
    setTargetPages(targetPageFilter: SearchTargetPageFilter): void;
}

export interface SearchPluginProps {
    enableShortcuts?: boolean;
    // The keyword that will be highlighted in all pages
    keyword?: SingleKeyword | SingleKeyword[];
    renderHighlights?(props: RenderHighlightsProps): React.ReactElement;
    onHighlightKeyword?(props: OnHighlightKeyword): void;
}

const normalizeKeywords = (keyword?: SingleKeyword | SingleKeyword[]): NormalizedKeyword[] =>
    Array.isArray(keyword) ? keyword.map((k) => normalizeSingleKeyword(k)) : [normalizeSingleKeyword(keyword)];

export const searchPlugin = (props?: SearchPluginProps): SearchPlugin => {
    const searchPluginProps = React.useMemo(
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        () => Object.assign({}, { enableShortcuts: true, onHighlightKeyword: () => {} }, props),
        [],
    );
    const store = React.useMemo(
        () =>
            createStore<StoreProps>({
                initialKeyword:
                    props && props.keyword ? (Array.isArray(props.keyword) ? props.keyword : [props.keyword]) : [],
                keyword: props && props.keyword ? normalizeKeywords(props.keyword) : [EMPTY_KEYWORD_REGEXP],
                matchPosition: {
                    matchIndex: -1,
                    pageIndex: -1,
                },
                renderStatus: new Map<number, PluginOnTextLayerRender>(),
            }),
        [],
    );
    const { clearKeyword, jumpToMatch, jumpToNextMatch, jumpToPreviousMatch, searchFor, setKeywords, setTargetPages } =
        useSearch(store);

    const SearchDecorator = (props: SearchProps) => <Search {...props} store={store} />;

    const ShowSearchPopoverDecorator = (props: ShowSearchPopoverProps) => (
        <ShowSearchPopover enableShortcuts={searchPluginProps.enableShortcuts} {...props} store={store} />
    );

    const ShowSearchPopoverButtonDecorator = () => (
        <ShowSearchPopoverDecorator>
            {(props) => (
                <ShowSearchPopoverButton enableShortcuts={searchPluginProps.enableShortcuts} store={store} {...props} />
            )}
        </ShowSearchPopoverDecorator>
    );

    const renderViewer = (renderViewerProps: RenderViewer): Slot => {
        const currentSlot = renderViewerProps.slot;
        if (currentSlot.subSlot) {
            currentSlot.subSlot.children = (
                <>
                    {searchPluginProps.enableShortcuts && (
                        <ShortcutHandler containerRef={renderViewerProps.containerRef} store={store} />
                    )}
                    {currentSlot.subSlot.children}
                </>
            );
        }

        return currentSlot;
    };

    const renderPageLayer = (renderProps: PluginRenderPageLayer) => (
        <Highlights
            key={renderProps.pageIndex}
            numPages={renderProps.doc.numPages}
            pageIndex={renderProps.pageIndex}
            renderHighlights={props?.renderHighlights}
            store={store}
            onHighlightKeyword={searchPluginProps.onHighlightKeyword}
        />
    );

    return {
        install: (pluginFunctions: PluginFunctions) => {
            const initialKeyword =
                props && props.keyword ? (Array.isArray(props.keyword) ? props.keyword : [props.keyword]) : [];
            const keyword = props && props.keyword ? normalizeKeywords(props.keyword) : [EMPTY_KEYWORD_REGEXP];

            store.update('initialKeyword', initialKeyword);
            store.update('jumpToDestination', pluginFunctions.jumpToDestination);
            store.update('jumpToPage', pluginFunctions.jumpToPage);
            store.update('keyword', keyword);
        },
        renderPageLayer,
        renderViewer,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        uninstall: (props: PluginFunctions) => {
            const renderStatus = store.get('renderStatus');
            if (renderStatus) {
                renderStatus.clear();
            }
        },
        onDocumentLoad: (props: PluginOnDocumentLoad) => {
            store.update('doc', props.doc);
        },
        onTextLayerRender: (props: PluginOnTextLayerRender) => {
            let renderStatus = store.get('renderStatus');
            if (renderStatus) {
                renderStatus = renderStatus.set(props.pageIndex, props);
                store.update('renderStatus', renderStatus);
            }
        },
        Search: SearchDecorator,
        ShowSearchPopover: ShowSearchPopoverDecorator,
        ShowSearchPopoverButton: ShowSearchPopoverButtonDecorator,
        clearHighlights: () => {
            clearKeyword();
        },
        highlight: (keyword: SingleKeyword | SingleKeyword[]) => {
            const keywords = Array.isArray(keyword) ? keyword : [keyword];
            setKeywords(keywords);
            return searchFor(keywords);
        },
        jumpToMatch,
        jumpToNextMatch,
        jumpToPreviousMatch,
        setTargetPages,
    };
};
