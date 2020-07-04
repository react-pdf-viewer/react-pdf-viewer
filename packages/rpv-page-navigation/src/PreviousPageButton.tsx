import React, { useEffect, useState } from 'react';
import { Store, StoreHandler } from '@phuocng/rpv';

import StoreProps from './StoreProps';

export interface RenderPreviousPageButtonProps {
    isDisabled: boolean;
    onClick: () => void;
}

export interface PreviousPageButtonProps {
    children?: ChildrenPreviousPageButton;
}

export type ChildrenPreviousPageButton = (props: RenderPreviousPageButtonProps) => React.ReactElement;

const PreviousPageButton: React.FC<{
    children?: ChildrenPreviousPageButton,
    store: Store<StoreProps>,
}> = ({ store, children }) => {
    const [currentPage, setCurrentPage] = useState(0);

    const handleCurrentPageChanged: StoreHandler<number> = (currentPage: number) => {
        setCurrentPage(currentPage);
    };

    useEffect(() => {
        store.subscribe('currentPage', handleCurrentPageChanged);

        return () => {
            store.unsubscribe('currentPage', handleCurrentPageChanged);
        };
    }, []);

    const goToPreviousPage = () => {
        const jumpToPage = store.get('jumpToPage');
        if (jumpToPage) {
            jumpToPage(currentPage - 1);
        }
    };

    const defaultChildren = (props: RenderPreviousPageButtonProps) => (
        <button onClick={props.onClick} disabled={props.isDisabled}>Previous</button>
    );
    const render = children || defaultChildren;

    return render({
        isDisabled: currentPage <= 0,
        onClick: goToPreviousPage,
    });
};

export default PreviousPageButton;
