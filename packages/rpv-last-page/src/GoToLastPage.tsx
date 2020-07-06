/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useEffect, useState } from 'react';
import { Store, StoreHandler } from '@phuocng/rpv';

import StoreProps from './StoreProps';

export interface RenderGoToLastPageProps {
    onClick: () => void;
}

export interface GoToLastPageProps {
    children: RenderGoToLastPage;
}

type RenderGoToLastPage = (props: RenderGoToLastPageProps) => React.ReactElement;

const GoToLastPage: React.FC<{
    children: RenderGoToLastPage,
    store: Store<StoreProps>,
}> = ({ children, store }) => {
    const [numberOfPages, setNumberOfPages] = useState(0);

    const handleNumberOfPages: StoreHandler<number> = (n: number) => {
        setNumberOfPages(n);
    };

    useEffect(() => {
        store.subscribe('numberOfPages', handleNumberOfPages);

        return () => {
            store.unsubscribe('numberOfPages', handleNumberOfPages);
        };
    }, []);

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
