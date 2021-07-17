/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import {
    createStore,
    Plugin,
    PluginFunctions,
    PluginOnDocumentLoad,
    PluginOnTextLayerRender,
    RenderViewer,
    Slot,
} from '@react-pdf-viewer/core';

import { EMPTY_KEYWORD_REGEXP } from './constants';
import { normalizeSingleKeyword } from './normalizeKeyword';
import Search, { SearchProps } from './Search';
import ShowSearchPopover, { ShowSearchPopoverProps } from './ShowSearchPopover';
import ShowSearchPopoverButton from './ShowSearchPopoverButton';
import GetMatchSample from './types/GetMatchSample';
import Match from './types/Match';
import SingleKeyword from './types/SingleKeyword';
import StoreProps from './types/StoreProps';
import OnHighlightKeyword from './types/OnHighlightKeyword';
import Tracker from './Tracker';
import useSearch from './useSearch';

interface SearchPlugin extends Plugin {
    Search(props: SearchProps): React.ReactElement;
    ShowSearchPopover(props: ShowSearchPopoverProps): React.ReactElement;
    ShowSearchPopoverButton(): React.ReactElement;
    clearHighlights(): void;
    highlight(keyword: SingleKeyword | SingleKeyword[]): Promise<Match[]>;
    jumpToMatch(index: number): Match | null;
    jumpToNextMatch(): Match | null;
    jumpToPreviousMatch(): Match | null;
}

export interface SearchPluginProps {
    // Extract a sample of matching text from the page's content
    getMatchSample?: (props: GetMatchSample) => string;
    // The keyword that will be highlighted in all pages
    keyword?: SingleKeyword | SingleKeyword[];
    onHighlightKeyword?(props: OnHighlightKeyword): void;
}

const searchPlugin = (props?: SearchPluginProps): SearchPlugin => {
    const onHighlightKeyword = React.useMemo(
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        () => (props && props.onHighlightKeyword ? props.onHighlightKeyword : () => {}),
        []
    );
    const store = React.useMemo(
        () =>
            createStore<StoreProps>({
                renderStatus: new Map<number, PluginOnTextLayerRender>(),
            }),
        []
    );
    const { clearKeyword, jumpToMatch, jumpToNextMatch, jumpToPreviousMatch, searchFor, setKeywords } = useSearch(
        store,
        props?.getMatchSample
    );

    const SearchDecorator = (props: SearchProps) => <Search {...props} store={store} />;

    const ShowSearchPopoverDecorator = (props: ShowSearchPopoverProps) => (
        <ShowSearchPopover {...props} store={store} />
    );

    const ShowSearchPopoverButtonDecorator = () => (
        <ShowSearchPopoverDecorator>{(props) => <ShowSearchPopoverButton {...props} />}</ShowSearchPopoverDecorator>
    );

    const renderViewer = (renderViewerProps: RenderViewer): Slot => {
        const currentSlot = renderViewerProps.slot;
        if (currentSlot.subSlot) {
            currentSlot.subSlot.children = (
                <>
                    {Array(renderViewerProps.doc.numPages)
                        .fill(0)
                        .map((_, index) => (
                            <Tracker
                                key={index}
                                pageIndex={index}
                                store={store}
                                onHighlightKeyword={onHighlightKeyword}
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
    };
};

export default searchPlugin;
