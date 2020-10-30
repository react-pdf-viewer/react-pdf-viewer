/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { ReactElement } from 'react';
import { createStore, Plugin, PluginFunctions, PluginOnDocumentLoad, PluginOnTextLayerRender, RenderViewer, Slot } from '@react-pdf-viewer/core';

import { EMPTY_KEYWORD_REGEXP } from './constants';
import Search, { SearchProps } from './Search';
import ShowSearchPopover, { ShowSearchPopoverProps } from './ShowSearchPopover';
import ShowSearchPopoverButton from './ShowSearchPopoverButton';
import StoreProps from './StoreProps';
import Tracker from './Tracker';

interface SearchPlugin extends Plugin {
    Search(props: SearchProps): ReactElement;
    ShowSearchPopover(props: ShowSearchPopoverProps): ReactElement;
    ShowSearchPopoverButton(): ReactElement;
}

export type SingleKeyword = string | RegExp;

export interface SearchPluginProps {
    // The keyword that will be highlighted in all pages
    keyword?: SingleKeyword | SingleKeyword[];
}

const searchPlugin = (props?: SearchPluginProps): SearchPlugin => {
    const store = createStore<StoreProps>({
        renderStatus: new Map<number, PluginOnTextLayerRender>(),
    });

    const SearchDecorator = (props: SearchProps) => (
        <Search {...props} store={store} />
    );

    const ShowSearchPopoverDecorator = (props: ShowSearchPopoverProps) => (
        <ShowSearchPopover {...props} store={store} />
    );

    const ShowSearchPopoverButtonDecorator = () => (
        <ShowSearchPopoverDecorator>
            {(props) => <ShowSearchPopoverButton {...props} />}
        </ShowSearchPopoverDecorator>
    );

    const renderViewer = (props: RenderViewer): Slot => {
        const currentSlot = props.slot;
        if (currentSlot.subSlot) {
            currentSlot.subSlot.children = (
                <>
                {
                    Array(props.doc.numPages).fill(0).map((_, index) => (
                        <Tracker key={index} pageIndex={index} store={store} />
                    ))
                }
                {currentSlot.subSlot.children}
                </>
            );
        }

        return currentSlot;
    };

    const normalizeKeywordItem = (keyword: SingleKeyword): RegExp => {
        return typeof keyword === 'string'
            ? (keyword === '' ? EMPTY_KEYWORD_REGEXP : new RegExp(keyword))
            : (keyword || EMPTY_KEYWORD_REGEXP);
    };

    return {
        install: (pluginFunctions: PluginFunctions) => {
            let keyword = [EMPTY_KEYWORD_REGEXP];
            if (props) {
                if (Array.isArray(props.keyword)) {
                    keyword = (props.keyword).map(k => normalizeKeywordItem(k));
                } else {
                    keyword = [normalizeKeywordItem(props.keyword)];
                }
            }

            store.update('jumpToDestination', pluginFunctions.jumpToDestination);
            store.update('jumpToPage', pluginFunctions.jumpToPage);
            store.update('keyword', keyword);
        },
        renderViewer,
        // eslint-disable-next-line  @typescript-eslint/no-unused-vars
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
    };
};

export default searchPlugin;
