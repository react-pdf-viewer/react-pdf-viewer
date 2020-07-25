/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { FC, ReactElement } from 'react';
import { Store } from '@phuocng/rpv';

import GoToNextPageButton from './GoToNextPageButton';
import StoreProps from './StoreProps';
import useCurrentPage from './useCurrentPage';
import useNumberOfPages from './useNumberOfPages';

export interface RenderGoToNextPageProps {
    isDisabled: boolean;
    onClick: () => void;
}

type RenderGoToNextPage = (props: RenderGoToNextPageProps) => ReactElement;

export interface GoToNextPageProps {
    children?: RenderGoToNextPage;
}

const GoToNextPage: FC<{
    children?: RenderGoToNextPage,
    store: Store<StoreProps>,
}> = ({ children, store }) => {
    const { currentPage } = useCurrentPage(store);
    const { numberOfPages } = useNumberOfPages(store);

    const goToNextPage = () => {
        const jumpToPage = store.get('jumpToPage');
        if (jumpToPage) {
            jumpToPage(currentPage + 1);
        }
    };

    const defaultChildren = (props: RenderGoToNextPageProps) => (
        <GoToNextPageButton onClick={props.onClick} isDisabled={props.isDisabled} />
    );

    const render = children || defaultChildren;
    return render({
        isDisabled: currentPage + 1 >= numberOfPages,
        onClick: goToNextPage,
    });
};

export default GoToNextPage;
