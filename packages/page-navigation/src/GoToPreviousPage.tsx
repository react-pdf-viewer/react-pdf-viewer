/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Store } from '@react-pdf-viewer/core';

import GoToPreviousPageButton from './GoToPreviousPageButton';
import StoreProps from './StoreProps';
import { RenderGoToPage, RenderGoToPageProps } from './types/index';
import useCurrentPage from './useCurrentPage';

const GoToPreviousPage: React.FC<{
    children?: RenderGoToPage;
    store: Store<StoreProps>;
}> = ({ store, children }) => {
    const { currentPage } = useCurrentPage(store);

    const goToPreviousPage = () => {
        const jumpToPage = store.get('jumpToPage');
        if (jumpToPage) {
            jumpToPage(currentPage - 1);
        }
    };

    const defaultChildren = (props: RenderGoToPageProps) => (
        <GoToPreviousPageButton isDisabled={props.isDisabled} onClick={props.onClick} />
    );
    const render = children || defaultChildren;

    return render({
        isDisabled: currentPage <= 0,
        onClick: goToPreviousPage,
    });
};

export default GoToPreviousPage;
