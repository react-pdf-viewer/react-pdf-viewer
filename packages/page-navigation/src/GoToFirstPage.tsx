/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Store } from '@react-pdf-viewer/core';

import GoToFirstPageButton from './GoToFirstPageButton';
import StoreProps from './StoreProps';
import useCurrentPage from './useCurrentPage';

export interface RenderGoToFirstPageProps {
    isDisabled: boolean;
    onClick: () => void;
}

type RenderGoToFirstPage = (props: RenderGoToFirstPageProps) => React.ReactElement;

export interface GoToFirstPageProps {
    children?: RenderGoToFirstPage;
}

const GoToFirstPage: React.FC<{
    children?: RenderGoToFirstPage,
    store: Store<StoreProps>,
}> = ({ children, store }) => {
    const { currentPage } = useCurrentPage(store);
    const goToFirstPage = () => {
        const jumpToPage = store.get('jumpToPage');
        if (jumpToPage) {
            jumpToPage(0);
        }
    };

    const defaultChildren = (props: RenderGoToFirstPageProps) => <GoToFirstPageButton isDisabled={props.isDisabled} onClick={props.onClick} />;
    const render = children || defaultChildren;

    return render({
        isDisabled: currentPage === 0,
        onClick: goToFirstPage,
    });
};

export default GoToFirstPage;
