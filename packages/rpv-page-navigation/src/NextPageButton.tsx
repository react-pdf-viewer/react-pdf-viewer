/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { FC, ReactElement, useContext } from 'react';
import { Button, LocalizationContext, Position, Store, Tooltip } from '@phuocng/rpv';

import NextIcon from './NextIcon';
import StoreProps from './StoreProps';
import useCurrentPage from './useCurrentPage';
import useNumberOfPages from './useNumberOfPages';

interface RenderNextPageButtonProps {
    isDisabled: boolean;
    onClick: () => void;
}

export interface NextPageButtonProps {
    children?: RenderNextPageButton;
}

type RenderNextPageButton = (props: RenderNextPageButtonProps) => ReactElement;

const TOOLTIP_OFFSET = { left: 0, top: 8 };

const NextPageButton: FC<{
    children?: RenderNextPageButton,
    store: Store<StoreProps>,
}> = ({ children, store }) => {
    const l10nContext = useContext(LocalizationContext);
    const { currentPage } = useCurrentPage(store);
    const { numberOfPages } = useNumberOfPages(store);

    const goToNextPage = () => {
        const jumpToPage = store.get('jumpToPage');
        if (jumpToPage) {
            jumpToPage(currentPage + 1);
        }
    };

    const defaultChildren = (props: RenderNextPageButtonProps) => {
        const label = (l10nContext && l10nContext.plugins && l10nContext.plugins.pageNavigation)
            ? l10nContext.plugins.pageNavigation.nextPage
            : 'Next page';

        return (
            <Tooltip
                position={Position.BottomCenter}
                target={<Button onClick={props.onClick}><NextIcon /></Button>}
                content={() => label}
                offset={TOOLTIP_OFFSET}
            />
        );
    };

    const render = children || defaultChildren;
    return render({
        isDisabled: currentPage + 1 >= numberOfPages,
        onClick: goToNextPage,
    });
};

export default NextPageButton;
