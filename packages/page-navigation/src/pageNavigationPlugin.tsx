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
import GoToFirstPage, { GoToFirstPageProps } from './GoToFirstPage';
import GoToFirstPageButton from './GoToFirstPageButton';
import GoToFirstPageMenuItem, { GoToFirstPageMenuItemProps } from './GoToFirstPageMenuItem';
import GoToLastPage, { GoToLastPageProps } from './GoToLastPage';
import GoToLastPageButton from './GoToLastPageButton';
import GoToLastPageMenuItem, { GoToLastPageMenuItemProps } from './GoToLastPageMenuItem';
import GoToNextPage, { GoToNextPageProps, RenderGoToNextPageProps } from './GoToNextPage';
import GoToNextPageButton from './GoToNextPageButton';
import GoToNextPageMenuItem from './GoToNextPageMenuItem';
import GoToPreviousPage, { GoToPreviousPageProps, RenderGoToPreviousPageProps } from './GoToPreviousPage';
import GoToPreviousPageMenuItem from './GoToPreviousPageMenuItem';
import GoToPreviousPageButton from './GoToPreviousPageButton';
import StoreProps from './StoreProps';

export interface PageNavigationPlugin extends Plugin {
    jumpToPage: (pageIndex: number) => void;
    CurrentPageInput: () => React.ReactElement;
    CurrentPageLabel: (props: CurrentPageLabelProps) => React.ReactElement;
    GoToFirstPage: (props: GoToFirstPageProps) => React.ReactElement;
    GoToFirstPageButton: () => React.ReactElement;
    GoToFirstPageMenuItem: (props: GoToFirstPageMenuItemProps) => React.ReactElement;
    GoToLastPage: (props: GoToLastPageProps) => React.ReactElement;
    GoToLastPageButton: () => React.ReactElement;
    GoToLastPageMenuItem: (props: GoToLastPageMenuItemProps) => React.ReactElement;
    GoToNextPage: (props: GoToNextPageProps) => React.ReactElement;
    GoToNextPageButton: () => React.ReactElement;
    GoToNextPageMenuItem: (props: RenderGoToNextPageProps) => React.ReactElement;
    GoToPreviousPage: (props: GoToPreviousPageProps) => React.ReactElement;
    GoToPreviousPageButton: () => React.ReactElement;
    GoToPreviousPageMenuItem: (props: RenderGoToPreviousPageProps) => React.ReactElement;
}

const pageNavigationPlugin = (): PageNavigationPlugin => {
    const store = React.useMemo(() => createStore<StoreProps>(), []);

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

    const GoToNextPageMenuItemDecorator = (props: RenderGoToNextPageProps) => (
        <GoToNextPageDecorator>
            {(p) => <GoToNextPageMenuItem isDisabled={props.isDisabled} onClick={() => { p.onClick(); props.onClick(); }} />}
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

    const GoToPreviousPageMenuItemDecorator = (props: RenderGoToPreviousPageProps) => (
        <GoToPreviousPageDecorator>
            {(p) => <GoToPreviousPageMenuItem isDisabled={props.isDisabled} onClick={() => { p.onClick(); props.onClick(); }} />}
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
