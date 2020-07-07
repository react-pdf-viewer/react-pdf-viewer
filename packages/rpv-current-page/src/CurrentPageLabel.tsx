/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useEffect, useState, ReactElement } from 'react';
import { Store, StoreHandler } from '@phuocng/rpv';

import StoreProps from './StoreProps';

interface RenderCurrentPageLabelProps {
    currentPage: number;
    numberOfPages: number;
}

export interface CurrentPageLabelProps {
    children?: RenderCurrentPageLabel;
}

type RenderCurrentPageLabel = (props: RenderCurrentPageLabelProps) => ReactElement;

const CurrentPageLabel: React.FC<{
    children?: RenderCurrentPageLabel,
    store: Store<StoreProps>,
}> = ({ children, store }) => {
    const [numberOfPages, setNumberOfPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    const handleNumberOfPages: StoreHandler<number> = (n: number) => {
        setNumberOfPages(n);
    };
    const handleCurrentPageChanged: StoreHandler<number> = (currentPage: number) => {
        setCurrentPage(currentPage);
    };

    useEffect(() => {
        store.subscribe('currentPage', handleCurrentPageChanged);
        store.subscribe('numberOfPages', handleNumberOfPages);

        return () => {
            store.unsubscribe('currentPage', handleCurrentPageChanged);
            store.unsubscribe('numberOfPages', handleNumberOfPages);
        };
    }, []);

    const defaultChildren = (props: RenderCurrentPageLabelProps) => <>{props.currentPage + 1}</>;

    const render = children || defaultChildren;
    return render({
        currentPage,
        numberOfPages,
    });
};

export default CurrentPageLabel;
