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

const TOOLTIP_OFFSET = { left: 0, top: 8 };

const ShowSearchPopoverButton: FC<RenderShowSearchPopoverProps> = ({ icon, label, onClick }) => (
    <Tooltip
        position={Position.BottomCenter}
        target={<Button onClick={onClick}>{icon}</Button>}
        content={() => label}
        offset={TOOLTIP_OFFSET}
    />
);

export default ShowSearchPopoverButton;
