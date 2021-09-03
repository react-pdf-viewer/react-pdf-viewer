/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { createStore } from '@react-pdf-viewer/core';
import type {
    Plugin,
    PluginFunctions,
    PluginOnDocumentLoad,
    PluginOnTextLayerRender,
    RenderViewer,
    Slot,
} from '@react-pdf-viewer/core';

import { EMPTY_KEYWORD_REGEXP } from './constants';
import { normalizeSingleKeyword } from './normalizeKeyword';
import { Search, SearchProps } from './Search';
import { ShortcutHandler } from './ShortcutHandler';
import { ShowSearchPopover, ShowSearchPopoverProps } from './ShowSearchPopover';
import { ShowSearchPopoverButton } from './ShowSearchPopoverButton';
import { Tracker } from './Tracker';
import { useSearch } from './useSearch';
import type { OnHighlightKeyword } from './types/OnHighlightKeyword';
import type { Match } from './types/Match';
import type { SearchTargetPageFilter } from './types/SearchTargetPage';
import type { SingleKeyword } from './types/SingleKeyword';
import type { StoreProps } from './types/StoreProps';

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
    onHighlightKeyword?(props: OnHighlightKeyword): void;
}

export const searchPlugin = (props?: SearchPluginProps): SearchPlugin => {
    const searchPluginProps = React.useMemo(
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        () => Object.assign({}, { enableShortcuts: true, onHighlightKeyword: () => {} }, props),
        []
    );
    const store = React.useMemo(
        () =>
            createStore<StoreProps>({
                renderStatus: new Map<number, PluginOnTextLayerRender>(),
            }),
        []
    );
    const { clearKeyword, jumpToMatch, jumpToNextMatch, jumpToPreviousMatch, searchFor, setKeywords, setTargetPages } =
        useSearch(store);

    const SearchDecorator = (props: SearchProps) => <Search {...props} store={store} />;

    const ShowSearchPopoverDecorator = (props: ShowSearchPopoverProps) => (
        <ShowSearchPopover {...props} store={store} />
    );

    const ShowSearchPopoverButtonDecorator = () => (
        <ShowSearchPopoverDecorator>
            {(props) => <ShowSearchPopoverButton store={store} {...props} />}
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
                    {Array(renderViewerProps.doc.numPages)
                        .fill(0)
                        .map((_, index) => (
                            <Tracker
                                key={index}
                                numPages={renderViewerProps.doc.numPages}
                                pageIndex={index}
                                store={store}
                                onHighlightKeyword={searchPluginProps.onHighlightKeyword}
                            />
                        ))}
                    {currentSlot.subSlot.children}
                </>
            );
        }

        return currentSlot;
    };

    const normalizeKeywords = (keyword?: SingleKeyword | SingleKeyword[]): RegExp[] =>
        Array.isArray(keyword) ? keyword.map((k) => normalizeSingleKeyword(k)) : [normalizeSingleKeyword(keyword)];

    return {
        install: (pluginFunctions: PluginFunctions) => {
            const keyword = props && props.keyword ? normalizeKeywords(props.keyword) : [EMPTY_KEYWORD_REGEXP];

            store.update('jumpToDestination', pluginFunctions.jumpToDestination);
            store.update('jumpToPage', pluginFunctions.jumpToPage);
            store.update('keyword', keyword);
        },
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
