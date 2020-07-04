import React, { useEffect, useState } from 'react';
import { Button, Position, PreviousIcon, Store, StoreHandler, Tooltip } from '@phuocng/rpv';

import StoreProps from './StoreProps';

export interface RenderPreviousPageButtonProps {
    isDisabled: boolean;
    onClick: () => void;
}

export interface PreviousPageButtonProps {
    children?: ChildrenPreviousPageButton;
}

export type ChildrenPreviousPageButton = (props: RenderPreviousPageButtonProps) => React.ReactElement;

const TOOLTIP_OFFSET = { left: 0, top: 8 };

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
        <Tooltip
            position={Position.BottomCenter}
            target={<Button onClick={props.onClick}><PreviousIcon /></Button>}
            content={() => 'Previous'}
            offset={TOOLTIP_OFFSET}
        />
    );
    const render = children || defaultChildren;

    return render({
        isDisabled: currentPage <= 0,
        onClick: goToPreviousPage,
    });
};

export default PreviousPageButton;
