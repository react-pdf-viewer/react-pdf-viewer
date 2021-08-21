/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Popover, Position, TextDirection, ThemeContext } from '@react-pdf-viewer/core';
import type { Store, Toggle } from '@react-pdf-viewer/core';

import { SearchPopover } from './SearchPopover';
import { ShowSearchPopoverButton } from './ShowSearchPopoverButton';
import type { RenderShowSearchPopoverProps } from './types/RenderShowSearchPopoverProps';
import type { StoreProps } from './types/StoreProps';

type RenderShowSearchPopover = (props: RenderShowSearchPopoverProps) => React.ReactElement;

export interface ShowSearchPopoverProps {
    children?: RenderShowSearchPopover;
}

const PORTAL_OFFSET = { left: 0, top: 8 };

export const ShowSearchPopover: React.FC<{
    children?: RenderShowSearchPopover;
    store: Store<StoreProps>;
}> = ({ children, store }) => {
    const { direction } = React.useContext(ThemeContext);
    const portalPosition = direction === TextDirection.RightToLeft ? Position.BottomRight : Position.BottomLeft;
    const defaultChildren = (props: RenderShowSearchPopoverProps) => <ShowSearchPopoverButton {...props} />;
    const render = children || defaultChildren;

    return (
        <Popover
            ariaControlsSuffix="search"
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
