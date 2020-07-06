/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { ReactElement } from 'react';
import { createStore, Plugin, PluginFunctions, PluginOnDocumentLoad } from '@phuocng/rpv';

import GoToLastPage, { GoToLastPageProps } from './GoToLastPage';
import GoToLastPageButton from './GoToLastPageButton';

import StoreProps from './StoreProps';

interface LastPagePlugin extends Plugin {
    GoToLastPage: (props: GoToLastPageProps) => ReactElement;
    GoToLastPageButton: () => ReactElement;
}

const lastPagePlugin = (): LastPagePlugin => {
    const store = createStore<StoreProps>({});

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

    return {
        install: (pluginFunctions: PluginFunctions) => {
            store.update('jumpToPage', pluginFunctions.jumpToPage);
        },
        onDocumentLoad: (props: PluginOnDocumentLoad) => {
            store.update('numberOfPages', props.doc.numPages);
        },
        GoToLastPage: GoToLastPageDecorator,
        GoToLastPageButton: GoToLastPageButtonDecorator,
    };
};

export default lastPagePlugin;
