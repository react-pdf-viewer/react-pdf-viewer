/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { ReactElement } from 'react';
import { createStore, Plugin, PluginFunctions, PluginOnDocumentLoad, ViewerState } from '@phuocng/rpv';

import CurrentPageInput from './CurrentPageInput';
import CurrentPageLabel, { CurrentPageLabelProps } from './CurrentPageLabel';
import GoToFirstPage, { GoToFirstPageProps } from './GoToFirstPage';
import GoToFirstPageButton from './GoToFirstPageButton';
import GoToFirstPageMenuItem, { GoToFirstPageMenuItemProps } from './GoToFirstPageMenuItem';
import GoToLastPage, { GoToLastPageProps } from './GoToLastPage';
import GoToLastPageButton from './GoToLastPageButton';
import GoToLastPageMenuItem, { GoToLastPageMenuItemProps } from './GoToLastPageMenuItem';
import GoToNextPage, { GoToNextPageProps } from './GoToNextPage';
import GoToNextPageButton from './GoToNextPageButton';
import GoToPreviousPage, { GoToPreviousPageProps } from './GoToPreviousPage';
import GoToPreviousPageButton from './GoToPreviousPageButton';
import StoreProps from './StoreProps';

export interface PageNavigationPlugin extends Plugin {
    CurrentPageInput: () => ReactElement;
    CurrentPageLabel: (props: CurrentPageLabelProps) => ReactElement;
    GoToFirstPage: (props: GoToFirstPageProps) => ReactElement;
    GoToFirstPageButton: () => ReactElement;
    GoToFirstPageMenuItem: (props: GoToFirstPageMenuItemProps) => ReactElement;
    GoToLastPage: (props: GoToLastPageProps) => ReactElement;
    GoToLastPageButton: () => ReactElement;
    GoToLastPageMenuItem: (props: GoToLastPageMenuItemProps) => ReactElement;
    GoToNextPage: (props: GoToNextPageProps) => ReactElement;
    GoToNextPageButton: () => ReactElement;
    GoToPreviousPage: (props: GoToPreviousPageProps) => ReactElement;
    GoToPreviousPageButton: () => ReactElement;
}

const pageNavigationPlugin = (): PageNavigationPlugin => {
    const store = createStore<StoreProps>();

    const CurrentPageInputDecorator = () => <CurrentPageInput store={store} />;

    const CurrentPageLabelDecorator = (props: CurrentPageLabelProps) => <CurrentPageLabel {...props} store={store} />;

    const GoToFirstPageDecorator = (props: GoToFirstPageProps) => (
        <GoToFirstPage {...props} store={store} />
    );

    const GoToFirstPageButtonDecorator = () => (
        <GoToFirstPageDecorator>
            {(props) => <GoToFirstPageButton {...props} />}
        </GoToFirstPageDecorator>
    );

    const GoToFirstPageMenuItemDecorator = (props: GoToFirstPageMenuItemProps) => (
        <GoToFirstPageDecorator>
            {(p) => <GoToFirstPageMenuItem onClick={() => { p.onClick(); props.onClick(); }} />}
        </GoToFirstPageDecorator>
    );

    const GoToLastPageDecorator = (props: GoToLastPageProps) => (
        <GoToLastPage {...props} store={store} />
    );

    const GoToLastPageButtonDecorator = () => (
        <GoToLastPageDecorator>
            {(props) => <GoToLastPageButton {...props} />}
        </GoToLastPageDecorator>
    );

    const GoToLastPageMenuItemDecorator = (props: GoToLastPageMenuItemProps) => (
        <GoToLastPageDecorator>
            {(p) => <GoToLastPageMenuItem onClick={() => { p.onClick(); props.onClick(); }} />}
        </GoToLastPageDecorator>
    );

    const GoToNextPageDecorator = (props: GoToNextPageProps) => (
        <GoToNextPage {...props} store={store} />
    );

    const GoToNextPageButtonDecorator = () => (
        <GoToNextPageDecorator>
            {(props) => <GoToNextPageButton {...props} />}
        </GoToNextPageDecorator>
    );

    const GoToPreviousPageDecorator = (props: GoToPreviousPageProps) => (
        <GoToPreviousPage {...props} store={store} />
    );

    const GoToPreviousPageButtonDecorator = () => (
        <GoToPreviousPageDecorator>
            {(props) => <GoToPreviousPageButton {...props} />}
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
        GoToPreviousPage: GoToPreviousPageDecorator,
        GoToPreviousPageButton: GoToPreviousPageButtonDecorator,
    };
};

export default pageNavigationPlugin;
