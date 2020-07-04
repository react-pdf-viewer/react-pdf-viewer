import React, { useEffect, useState } from 'react';
import { Store, StoreHandler } from '@phuocng/rpv';

import StoreProps from './StoreProps';

export interface RenderNextPageButtonProps {
    isDisabled: boolean;
    onClick: () => void;
}

export interface NextPageButtonProps {
    children?: ChildrenNextPageButton;
}

export type ChildrenNextPageButton = (props: RenderNextPageButtonProps) => React.ReactElement;

const NextPageButton: React.FC<{
    children?: ChildrenNextPageButton,
    store: Store<StoreProps>,
}> = ({ store, children }) => {
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

    const goToNextPage = () => {
        const jumpToPage = store.get('jumpToPage');
        if (jumpToPage) {
            jumpToPage(currentPage + 1);
        }
    };

    const defaultChildren = (props: RenderNextPageButtonProps) => (
        <button onClick={props.onClick} disabled={props.isDisabled}>Next</button>
    );
    const render = children || defaultChildren;

    return render({
        isDisabled: currentPage + 1 >= numberOfPages,
        onClick: goToNextPage,
    });
};

export default NextPageButton;
