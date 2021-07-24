/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import type { Store } from '@react-pdf-viewer/core/lib';

import GoToLastPageButton from './GoToLastPageButton';
import StoreProps from './StoreProps';
import { RenderGoToPage, RenderGoToPageProps } from './types/index';
import useCurrentPage from './useCurrentPage';
import useNumberOfPages from './useNumberOfPages';

const GoToLastPage: React.FC<{
    children?: RenderGoToPage;
    store: Store<StoreProps>;
}> = ({ children, store }) => {
    const { currentPage } = useCurrentPage(store);
    const { numberOfPages } = useNumberOfPages(store);

    const goToLastPage = () => {
        const jumpToPage = store.get('jumpToPage');
        if (jumpToPage) {
            jumpToPage(numberOfPages - 1);
        }
    };

    const defaultChildren = (props: RenderGoToPageProps) => (
        <GoToLastPageButton isDisabled={props.isDisabled} onClick={props.onClick} />
    );
    const render = children || defaultChildren;

    return render({
        isDisabled: currentPage + 1 >= numberOfPages,
        onClick: goToLastPage,
    });
};

export default GoToLastPage;
