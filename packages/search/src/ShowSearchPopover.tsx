/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { ReactElement, useContext } from 'react';
import { LocalizationContext, Popover, Position, Store, Toggle } from '@react-pdf-viewer/core';

import SearchIcon from './SearchIcon';
import SearchPopover from './SearchPopover';
import ShowSearchPopoverButton from './ShowSearchPopoverButton';
import StoreProps from './StoreProps';
import useDocument from './useDocument';

export interface RenderShowSearchPopoverProps {
    icon: ReactElement;
    label: string;
    onClick(): void;
}

type RenderShowSearchPopover = (props: RenderShowSearchPopoverProps) => ReactElement;

export interface ShowSearchPopoverProps {
    children?: RenderShowSearchPopover;
}

const PORTAL_OFFSET = { left: 0, top: 8 };

const ShowSearchPopover: React.FC<{
    children?: RenderShowSearchPopover,
    store: Store<StoreProps>,
}> = ({ children, store }) => {
    const { currentDoc } = useDocument(store);
    const l10n = useContext(LocalizationContext);

    const label = l10n && l10n.search ? l10n.search.search : 'Search';

    const defaultChildren = (props: RenderShowSearchPopoverProps) => (
        <ShowSearchPopoverButton {...props} />
    );
    const render = children || defaultChildren;

    return (
        currentDoc
            ? (
                <Popover
                    position={Position.BottomLeft}
                    target={
                        (toggle: Toggle) => render({
                            icon: <SearchIcon />,
                            label: label as string,
                            onClick: toggle,
                        })
                    }
                    content={
                        (toggle: Toggle) => <SearchPopover doc={currentDoc} store={store} onToggle={toggle} />
                    }
                    offset={PORTAL_OFFSET}
                    closeOnClickOutside={false}
                    closeOnEscape={true}
                />
            )
            : <></>
    );
};

export default ShowSearchPopover;
