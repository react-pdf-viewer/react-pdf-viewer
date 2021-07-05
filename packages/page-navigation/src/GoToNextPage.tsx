/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Store } from '@react-pdf-viewer/core';

import GoToNextPageButton from './GoToNextPageButton';
import StoreProps from './StoreProps';
import { RenderGoToPage, RenderGoToPageProps } from './types/index';
import useCurrentPage from './useCurrentPage';
import useNumberOfPages from './useNumberOfPages';

const GoToNextPage: React.FC<{
    children?: RenderGoToPage;
    store: Store<StoreProps>;
}> = ({ children, store }) => {
    const { currentPage } = useCurrentPage(store);
    const { numberOfPages } = useNumberOfPages(store);

    const goToNextPage = () => {
        const jumpToPage = store.get('jumpToPage');
        if (jumpToPage) {
            jumpToPage(currentPage + 1);
        }
    };

    const defaultChildren = (props: RenderGoToPageProps) => (
        <GoToNextPageButton onClick={props.onClick} isDisabled={props.isDisabled} />
    );

    const render = children || defaultChildren;
    return render({
        isDisabled: currentPage + 1 >= numberOfPages,
        onClick: goToNextPage,
    });
};

export default GoToNextPage;
