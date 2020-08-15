/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { FC, ReactElement } from 'react';
import { Store } from '@react-pdf-viewer/core';

import GoToFirstPageButton from './GoToFirstPageButton';
import StoreProps from './StoreProps';

export interface RenderGoToFirstPageProps {
    onClick: () => void;
}

type RenderGoToFirstPage = (props: RenderGoToFirstPageProps) => ReactElement;

export interface GoToFirstPageProps {
    children?: RenderGoToFirstPage;
}

const GoToFirstPage: FC<{
    children?: RenderGoToFirstPage,
    store: Store<StoreProps>,
}> = ({ children, store }) => {
    const goToFirstPage = () => {
        const jumpToPage = store.get('jumpToPage');
        if (jumpToPage) {
            jumpToPage(0);
        }
    };

    const defaultChildren = (props: RenderGoToFirstPageProps) => <GoToFirstPageButton onClick={props.onClick} />;
    const render = children || defaultChildren;

    return render({
        onClick: goToFirstPage,
    });
};

export default GoToFirstPage;
