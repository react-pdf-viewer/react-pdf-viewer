/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { FC, ReactElement, useContext } from 'react';
import { Button, LocalizationContext, Position, PreviousIcon, Store, Tooltip } from '@phuocng/rpv';

import StoreProps from './StoreProps';
import useCurrentPage from './useCurrentPage';

interface RenderPreviousPageButtonProps {
    isDisabled: boolean;
    onClick: () => void;
}

export interface PreviousPageButtonProps {
    children?: RenderPreviousPageButton;
}

export type RenderPreviousPageButton = (props: RenderPreviousPageButtonProps) => ReactElement;

const TOOLTIP_OFFSET = { left: 0, top: 8 };

const PreviousPageButton: FC<{
    children?: RenderPreviousPageButton,
    store: Store<StoreProps>,
}> = ({ store, children }) => {
    const l10nContext = useContext(LocalizationContext);
    const { currentPage } = useCurrentPage(store);

    const goToPreviousPage = () => {
        const jumpToPage = store.get('jumpToPage');
        if (jumpToPage) {
            jumpToPage(currentPage - 1);
        }
    };

    const defaultChildren = (props: RenderPreviousPageButtonProps) => {
        const label = (l10nContext && l10nContext.plugins && l10nContext.plugins.pageNavigation)
            ? l10nContext.plugins.pageNavigation.previousPage
            : 'Previous page';

        return (
            <Tooltip
                position={Position.BottomCenter}
                target={<Button onClick={props.onClick}><PreviousIcon /></Button>}
                content={() => label}
                offset={TOOLTIP_OFFSET}
            />
        );
    };
    const render = children || defaultChildren;

    return render({
        isDisabled: currentPage <= 0,
        onClick: goToPreviousPage,
    });
};

export default PreviousPageButton;
