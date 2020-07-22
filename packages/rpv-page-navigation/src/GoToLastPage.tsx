/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { FC, ReactElement } from 'react';
import { Store } from '@phuocng/rpv';

import StoreProps from './StoreProps';
import useNumberOfPages from './useNumberOfPages';

export interface RenderGoToLastPageProps {
    onClick: () => void;
}

export interface GoToLastPageProps {
    children: RenderGoToLastPage;
}

type RenderGoToLastPage = (props: RenderGoToLastPageProps) => ReactElement;

const GoToLastPage: FC<{
    children: RenderGoToLastPage,
    store: Store<StoreProps>,
}> = ({ children, store }) => {
    const { numberOfPages } = useNumberOfPages(store);

    const goToFirstPage = () => {
        const jumpToPage = store.get('jumpToPage');
        if (jumpToPage) {
            jumpToPage(numberOfPages - 1);
        }
    };

    return children({
        onClick: goToFirstPage,
    });
};

export default GoToLastPage;
