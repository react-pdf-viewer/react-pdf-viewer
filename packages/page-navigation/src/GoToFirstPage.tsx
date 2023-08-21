/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { type Store } from '@react-pdf-viewer/core';
import * as React from 'react';
import { GoToFirstPageButton } from './GoToFirstPageButton';
import { type StoreProps } from './types/StoreProps';
import { type RenderGoToPage, type RenderGoToPageProps } from './types/index';
import { useCurrentPage } from './useCurrentPage';

export const GoToFirstPage: React.FC<{
    children?: RenderGoToPage;
    store: Store<StoreProps>;
}> = ({ children, store }) => {
    const { currentPage } = useCurrentPage(store);
    const goToFirstPage = () => {
        const jumpToPage = store.get('jumpToPage');
        if (jumpToPage) {
            jumpToPage(0);
        }
    };

    const defaultChildren = (props: RenderGoToPageProps) => (
        <GoToFirstPageButton isDisabled={props.isDisabled} onClick={props.onClick} />
    );
    const render = children || defaultChildren;

    return render({
        isDisabled: currentPage === 0,
        onClick: goToFirstPage,
    });
};
