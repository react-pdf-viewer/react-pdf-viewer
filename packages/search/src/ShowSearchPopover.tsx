/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { Popover, Position, TextDirection, ThemeContext, type Store, type Toggle } from '@react-pdf-viewer/core';
import * as React from 'react';
import { SearchPopover } from './SearchPopover';
import { ShowSearchPopoverButton } from './ShowSearchPopoverButton';
import { type RenderShowSearchPopoverProps } from './types/RenderShowSearchPopoverProps';
import { type StoreProps } from './types/StoreProps';

type RenderShowSearchPopover = (props: RenderShowSearchPopoverProps) => React.ReactElement;

export interface ShowSearchPopoverProps {
    children?: RenderShowSearchPopover;
}

const PORTAL_OFFSET = { left: 0, top: 8 };

export const ShowSearchPopover: React.FC<{
    children?: RenderShowSearchPopover;
    enableShortcuts: boolean;
    store: Store<StoreProps>;
}> = ({ children, enableShortcuts, store }) => {
    const { direction } = React.useContext(ThemeContext);
    const portalPosition = direction === TextDirection.RightToLeft ? Position.BottomRight : Position.BottomLeft;
    const defaultChildren = (props: RenderShowSearchPopoverProps) => (
        <ShowSearchPopoverButton enableShortcuts={enableShortcuts} store={store} {...props} />
    );
    const render = children || defaultChildren;

    return (
        <Popover
            ariaControlsSuffix="search"
            lockScroll={false}
            position={portalPosition}
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
