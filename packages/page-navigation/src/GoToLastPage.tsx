/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Store } from '@react-pdf-viewer/core';

import GoToLastPageButton from './GoToLastPageButton';
import StoreProps from './StoreProps';
import useCurrentPage from './useCurrentPage';
import useNumberOfPages from './useNumberOfPages';

export interface RenderGoToLastPageProps {
    isDisabled: boolean;
    onClick: () => void;
}

type RenderGoToLastPage = (props: RenderGoToLastPageProps) => React.ReactElement;

export interface GoToLastPageProps {
    children?: RenderGoToLastPage;
}

const GoToLastPage: React.FC<{
    children?: RenderGoToLastPage,
    store: Store<StoreProps>,
}> = ({ children, store }) => {
    const { currentPage } = useCurrentPage(store);
    const { numberOfPages } = useNumberOfPages(store);

    const goToLastPage = () => {
        const jumpToPage = store.get('jumpToPage');
        if (jumpToPage) {
            jumpToPage(numberOfPages - 1);
        }
    };

    const defaultChildren = (props: RenderGoToLastPageProps) => <GoToLastPageButton isDisabled={props.isDisabled} onClick={props.onClick} />;
    const render = children || defaultChildren;

    return render({
        isDisabled: currentPage + 1 >= numberOfPages,
        onClick: goToLastPage,
    });
};

export default GoToLastPage;
