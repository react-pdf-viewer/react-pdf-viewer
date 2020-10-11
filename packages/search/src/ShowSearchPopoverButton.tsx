/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { FC } from 'react';
import { Button, Position, Tooltip } from '@react-pdf-viewer/core';

import { RenderShowSearchPopoverProps } from './ShowSearchPopover';
import ShowSearchPopoverDecorator from './ShowSearchPopoverDecorator';

const TOOLTIP_OFFSET = { left: 0, top: 8 };

const ShowSearchPopoverButton: FC<RenderShowSearchPopoverProps> = ({ onClick }) => (
    <ShowSearchPopoverDecorator onClick={onClick}>
    {
        (p) => (
            <Tooltip
                position={Position.BottomCenter}
                target={<Button onClick={onClick}>{p.icon}</Button>}
                content={() => p.label}
                offset={TOOLTIP_OFFSET}
            />
        )   
    }
    </ShowSearchPopoverDecorator>
);

export default ShowSearchPopoverButton;
