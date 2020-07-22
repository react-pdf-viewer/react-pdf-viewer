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
import GoToLastPage, { GoToLastPageProps } from './GoToLastPage';
import GoToLastPageButton from './GoToLastPageButton';
import NextPageButton, { NextPageButtonProps } from './NextPageButton';
import PreviousPageButton, { PreviousPageButtonProps } from './PreviousPageButton';
import StoreProps from './StoreProps';

export interface PageNavigationPlugin extends Plugin {
    CurrentPageInput: () => ReactElement;
    CurrentPageLabel: (props: CurrentPageLabelProps) => ReactElement;
    GoToFirstPage: (props: GoToFirstPageProps) => ReactElement;
    GoToFirstPageButton: () => ReactElement;
    GoToLastPage: (props: GoToLastPageProps) => ReactElement;
    GoToLastPageButton: () => ReactElement;
    NextPageButton: (props: NextPageButtonProps) => ReactElement;
    PreviousPageButton: (props: PreviousPageButtonProps) => ReactElement;
}

const pageNavigationPlugin = (): PageNavigationPlugin => {
    const store = createStore<StoreProps>();

    const CurrentPageInputDecorator = () => <CurrentPageInput store={store} />

    const CurrentPageLabelDecorator = (props: CurrentPageLabelProps) => <CurrentPageLabel {...props} store={store} />;

    const GoToFirstPageDecorator = (props: GoToFirstPageProps) => (
        <GoToFirstPage {...props} store={store} />
    );

    const GoToFirstPageButtonDecorator = () => (
        <GoToFirstPageDecorator>
            {
                (props) => <GoToFirstPageButton {...props} />
            }
        </GoToFirstPageDecorator>
    );

    const GoToLastPageDecorator = (props: GoToLastPageProps) => (
        <GoToLastPage {...props} store={store} />
    );

    const GoToLastPageButtonDecorator = () => (
        <GoToLastPageDecorator>
            {
                (props) => <GoToLastPageButton {...props} />
            }
        </GoToLastPageDecorator>
    );

    const NextPageButtonDecorator = (props: NextPageButtonProps) => (
        <NextPageButton {...props} store={store} />
    );

    const PreviousPageButtonDecorator = (props: PreviousPageButtonProps) => (
        <PreviousPageButton {...props} store={store} />
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
        GoToLastPage: GoToLastPageDecorator,
        GoToLastPageButton: GoToLastPageButtonDecorator,
        NextPageButton: NextPageButtonDecorator,
        PreviousPageButton: PreviousPageButtonDecorator,
    };
};

export default pageNavigationPlugin;
