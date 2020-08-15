/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { FC } from 'react';
import { Button, Position, Tooltip } from '@react-pdf-viewer/core';

import { RenderSwitchScrollModeProps } from './SwitchScrollMode';
import SwitchScrollModeDecorator from './SwitchScrollModeDecorator';

const TOOLTIP_OFFSET = { left: 0, top: 8 };

const SwitchScrollModeButton: FC<RenderSwitchScrollModeProps> = ({ isSelected, mode, onClick }) => (
    <SwitchScrollModeDecorator mode={mode} onClick={onClick}>
        {
            (props) => (
                <Tooltip
                    position={Position.BottomCenter}
                    target={<Button isSelected={isSelected} onClick={props.onClick}>{props.icon}</Button>}
                    content={() => props.label}
                    offset={TOOLTIP_OFFSET}
                />
            )
        }
    </SwitchScrollModeDecorator>
);

export default SwitchScrollModeButton;
