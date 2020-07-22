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

export interface RenderGoToFirstPageProps {
    onClick: () => void;
}

export interface GoToFirstPageProps {
    children: RenderGoToFirstPage;
}

type RenderGoToFirstPage = (props: RenderGoToFirstPageProps) => ReactElement;

const GoToFirstPage: FC<{
    children: RenderGoToFirstPage,
    store: Store<StoreProps>,
}> = ({ children, store }) => {
    const goToFirstPage = () => {
        const jumpToPage = store.get('jumpToPage');
        if (jumpToPage) {
            jumpToPage(0);
        }
    };

    return children({
        onClick: goToFirstPage,
    });
};

export default GoToFirstPage;
