/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { MinimalButton, Position, Tooltip } from '@react-pdf-viewer/core';

import { RenderShowSearchPopoverProps } from './ShowSearchPopover';
import ShowSearchPopoverDecorator from './ShowSearchPopoverDecorator';

const TOOLTIP_OFFSET = { left: 0, top: 8 };

const ShowSearchPopoverButton: React.FC<RenderShowSearchPopoverProps> = ({ onClick }) => (
    <ShowSearchPopoverDecorator onClick={onClick}>
        {(p) => (
            <Tooltip
                position={Position.BottomCenter}
                target={
                    <MinimalButton label={p.label} onClick={onClick}>
                        {p.icon}
                    </MinimalButton>
                }
                content={() => p.label}
                offset={TOOLTIP_OFFSET}
            />
        )}
    </ShowSearchPopoverDecorator>
);

export default ShowSearchPopoverButton;
