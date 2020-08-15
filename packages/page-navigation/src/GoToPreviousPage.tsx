/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { FC, ReactElement } from 'react';
import { Store } from '@react-pdf-viewer/core';

import GoToPreviousPageButton from './GoToPreviousPageButton';
import StoreProps from './StoreProps';
import useCurrentPage from './useCurrentPage';

export interface RenderGoToPreviousPageProps {
    isDisabled: boolean;
    onClick: () => void;
}

type RenderGoToPreviousPage = (props: RenderGoToPreviousPageProps) => ReactElement;

export interface GoToPreviousPageProps {
    children?: RenderGoToPreviousPage;
}

const GoToPreviousPage: FC<{
    children?: RenderGoToPreviousPage,
    store: Store<StoreProps>,
}> = ({ store, children }) => {
    const { currentPage } = useCurrentPage(store);

    const goToPreviousPage = () => {
        const jumpToPage = store.get('jumpToPage');
        if (jumpToPage) {
            jumpToPage(currentPage - 1);
        }
    };

    const defaultChildren = (props: RenderGoToPreviousPageProps) => (
        <GoToPreviousPageButton isDisabled={props.isDisabled} onClick={props.onClick} />
    );
    const render = children || defaultChildren;

    return render({
        isDisabled: currentPage <= 0,
        onClick: goToPreviousPage,
    });
};

export default GoToPreviousPage;
