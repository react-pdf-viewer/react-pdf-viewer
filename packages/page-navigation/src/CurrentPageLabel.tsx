/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Store } from '@react-pdf-viewer/core';

import StoreProps from './StoreProps';
import useCurrentPage from './useCurrentPage';
import useNumberOfPages from './useNumberOfPages';

interface RenderCurrentPageLabelProps {
    currentPage: number;
    numberOfPages: number;
}

type RenderCurrentPageLabel = (props: RenderCurrentPageLabelProps) => React.ReactElement;

export interface CurrentPageLabelProps {
    children?: RenderCurrentPageLabel;
}

const CurrentPageLabel: React.FC<{
    children?: RenderCurrentPageLabel,
    store: Store<StoreProps>,
}> = ({ children, store }) => {
    const { currentPage } = useCurrentPage(store);
    const { numberOfPages } = useNumberOfPages(store);

    const defaultChildren = (props: RenderCurrentPageLabelProps) => <>{props.currentPage + 1}</>;

    const render = children || defaultChildren;
    return render({
        currentPage,
        numberOfPages,
    });
};

export default CurrentPageLabel;
