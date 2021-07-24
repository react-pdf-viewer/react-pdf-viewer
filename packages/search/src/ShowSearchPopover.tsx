/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Popover, Position } from '@react-pdf-viewer/core';
import type { Store, Toggle } from '@react-pdf-viewer/core/lib';

import SearchPopover from './SearchPopover';
import ShowSearchPopoverButton from './ShowSearchPopoverButton';
import StoreProps from './types/StoreProps';

export interface RenderShowSearchPopoverProps {
    onClick(): void;
}

type RenderShowSearchPopover = (props: RenderShowSearchPopoverProps) => React.ReactElement;

export interface ShowSearchPopoverProps {
    children?: RenderShowSearchPopover;
}

const PORTAL_OFFSET = { left: 0, top: 8 };

const ShowSearchPopover: React.FC<{
    children?: RenderShowSearchPopover;
    store: Store<StoreProps>;
}> = ({ children, store }) => {
    const defaultChildren = (props: RenderShowSearchPopoverProps) => <ShowSearchPopoverButton {...props} />;
    const render = children || defaultChildren;

    return (
        <Popover
            ariaControlsSuffix="search"
            position={Position.BottomLeft}
            target={(toggle: Toggle) =>
                render({
                    onClick: toggle,
                })
            }
            content={(toggle: Toggle) => <SearchPopover store={store} onToggle={toggle} />}
            offset={PORTAL_OFFSET}
            closeOnClickOutside={false}
            closeOnEscape={true}
        />
    );
};

export default ShowSearchPopover;
