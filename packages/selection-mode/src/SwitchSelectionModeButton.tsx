/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { FC } from 'react';
import { Button, Position, Tooltip } from '@react-pdf-viewer/core';

import { RenderSwitchSelectionModeProps } from './SwitchSelectionMode';
import SwitchSelectionModeDecorator from './SwitchSelectionModeDecorator';

const TOOLTIP_OFFSET = { left: 0, top: 8 };

const SwitchSelectionModeButton: FC<RenderSwitchSelectionModeProps> = ({ isSelected, mode, onClick }) => (
    <SwitchSelectionModeDecorator mode={mode} onClick={onClick}>
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
    </SwitchSelectionModeDecorator>
);

export default SwitchSelectionModeButton;
