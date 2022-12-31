/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { Store } from '@react-pdf-viewer/core';
import * as React from 'react';
import { GoToNextPageButton } from './GoToNextPageButton';
import type { RenderGoToPage, RenderGoToPageProps } from './types/index';
import type { StoreProps } from './types/StoreProps';
import { useCurrentPage } from './useCurrentPage';
import { useNumberOfPages } from './useNumberOfPages';

export const GoToNextPage: React.FC<{
    children?: RenderGoToPage;
    store: Store<StoreProps>;
}> = ({ children, store }) => {
    const { currentPage } = useCurrentPage(store);
    const { numberOfPages } = useNumberOfPages(store);

    const goToNextPage = () => {
        const jumpToNextPage = store.get('jumpToNextPage');
        if (jumpToNextPage) {
            jumpToNextPage();
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
