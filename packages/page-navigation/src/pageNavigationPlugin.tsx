/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { createStore, Plugin, PluginFunctions, PluginOnDocumentLoad, ViewerState } from '@react-pdf-viewer/core';

import CurrentPageInput from './CurrentPageInput';
import CurrentPageLabel, { CurrentPageLabelProps } from './CurrentPageLabel';
import GoToFirstPage from './GoToFirstPage';
import GoToFirstPageButton from './GoToFirstPageButton';
import GoToFirstPageMenuItem from './GoToFirstPageMenuItem';
import GoToLastPage from './GoToLastPage';
import GoToLastPageButton from './GoToLastPageButton';
import GoToLastPageMenuItem from './GoToLastPageMenuItem';
import GoToNextPage from './GoToNextPage';
import GoToNextPageButton from './GoToNextPageButton';
import GoToNextPageMenuItem from './GoToNextPageMenuItem';
import GoToPreviousPage from './GoToPreviousPage';
import GoToPreviousPageMenuItem from './GoToPreviousPageMenuItem';
import GoToPreviousPageButton from './GoToPreviousPageButton';
import StoreProps from './StoreProps';

import type { GoToPageMenuItemProps, GoToPageProps } from './types';

export interface PageNavigationPlugin extends Plugin {
    jumpToPage: (pageIndex: number) => void;
    CurrentPageInput: () => React.ReactElement;
    CurrentPageLabel: (props: CurrentPageLabelProps) => React.ReactElement;
    GoToFirstPage: (props: GoToPageProps) => React.ReactElement;
    GoToFirstPageButton: () => React.ReactElement;
    GoToFirstPageMenuItem: (props: GoToPageMenuItemProps) => React.ReactElement;
    GoToLastPage: (props: GoToPageProps) => React.ReactElement;
    GoToLastPageButton: () => React.ReactElement;
    GoToLastPageMenuItem: (props: GoToPageMenuItemProps) => React.ReactElement;
    GoToNextPage: (props: GoToPageProps) => React.ReactElement;
    GoToNextPageButton: () => React.ReactElement;
    GoToNextPageMenuItem: (props: GoToPageMenuItemProps) => React.ReactElement;
    GoToPreviousPage: (props: GoToPageProps) => React.ReactElement;
    GoToPreviousPageButton: () => React.ReactElement;
    GoToPreviousPageMenuItem: (props: GoToPageMenuItemProps) => React.ReactElement;
}

const pageNavigationPlugin = (): PageNavigationPlugin => {
    const store = React.useMemo(() => createStore<StoreProps>(), []);

    const CurrentPageInputDecorator = () => <CurrentPageInput store={store} />;

    const CurrentPageLabelDecorator = (props: CurrentPageLabelProps) => <CurrentPageLabel {...props} store={store} />;

    const GoToFirstPageDecorator = (props: GoToPageProps) => (
        <GoToFirstPage {...props} store={store} />
    );

    const GoToFirstPageButtonDecorator = () => (
        <GoToFirstPageDecorator>
            {(props) => <GoToFirstPageButton {...props} />}
        </GoToFirstPageDecorator>
    );

    const GoToFirstPageMenuItemDecorator = (props: GoToPageMenuItemProps) => (
        <GoToFirstPageDecorator>
            {(p) => <GoToFirstPageMenuItem isDisabled={p.isDisabled} onClick={() => { p.onClick(); props.onClick(); }} />}
        </GoToFirstPageDecorator>
    );

    const GoToLastPageDecorator = (props: GoToPageProps) => (
        <GoToLastPage {...props} store={store} />
    );

    const GoToLastPageButtonDecorator = () => (
        <GoToLastPageDecorator>
            {(props) => <GoToLastPageButton {...props} />}
        </GoToLastPageDecorator>
    );

    const GoToLastPageMenuItemDecorator = (props: GoToPageMenuItemProps) => (
        <GoToLastPageDecorator>
            {(p) => <GoToLastPageMenuItem isDisabled={p.isDisabled} onClick={() => { p.onClick(); props.onClick(); }} />}
        </GoToLastPageDecorator>
    );

    const GoToNextPageDecorator = (props: GoToPageProps) => (
        <GoToNextPage {...props} store={store} />
    );

    const GoToNextPageButtonDecorator = () => (
        <GoToNextPageDecorator>
            {(props) => <GoToNextPageButton {...props} />}
        </GoToNextPageDecorator>
    );

    const GoToNextPageMenuItemDecorator = (props: GoToPageMenuItemProps) => (
        <GoToNextPageDecorator>
            {(p) => <GoToNextPageMenuItem isDisabled={p.isDisabled} onClick={() => { p.onClick(); props.onClick(); }} />}
        </GoToNextPageDecorator>
    );

    const GoToPreviousPageDecorator = (props: GoToPageProps) => (
        <GoToPreviousPage {...props} store={store} />
    );

    const GoToPreviousPageButtonDecorator = () => (
        <GoToPreviousPageDecorator>
            {(props) => <GoToPreviousPageButton {...props} />}
        </GoToPreviousPageDecorator>
    );

    const GoToPreviousPageMenuItemDecorator = (props: GoToPageMenuItemProps) => (
        <GoToPreviousPageDecorator>
            {(p) => <GoToPreviousPageMenuItem isDisabled={p.isDisabled} onClick={() => { p.onClick(); props.onClick(); }} />}
        </GoToPreviousPageDecorator>
    );

    return {
        install: (pluginFunctions: PluginFunctions) => {
            store.update('jumpToPage', pluginFunctions.jumpToPage);
        },
        onDocumentLoad: (props: PluginOnDocumentLoad) => {
            store.update('numberOfPages', props.doc.numPages);
        },
        onViewerStateChange: (viewerState: ViewerState): ViewerState => {
            store.update('currentPage', viewerState.pageIndex);
            return viewerState;
        },
        jumpToPage: (pageIndex: number) => {
            const jumpTo = store.get('jumpToPage');
            if (jumpTo) {
                jumpTo(pageIndex);
            }
        },
        CurrentPageInput: CurrentPageInputDecorator,
        CurrentPageLabel: CurrentPageLabelDecorator,
        GoToFirstPage: GoToFirstPageDecorator,
        GoToFirstPageButton: GoToFirstPageButtonDecorator,
        GoToFirstPageMenuItem: GoToFirstPageMenuItemDecorator,
        GoToLastPage: GoToLastPageDecorator,
        GoToLastPageButton: GoToLastPageButtonDecorator,
        GoToLastPageMenuItem: GoToLastPageMenuItemDecorator,
        GoToNextPage: GoToNextPageDecorator,
        GoToNextPageButton: GoToNextPageButtonDecorator,
        GoToNextPageMenuItem: GoToNextPageMenuItemDecorator,
        GoToPreviousPage: GoToPreviousPageDecorator,
        GoToPreviousPageButton: GoToPreviousPageButtonDecorator,
        GoToPreviousPageMenuItem: GoToPreviousPageMenuItemDecorator,
    };
};

export default pageNavigationPlugin;
