/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { MinimalButton, Position, Tooltip } from '@react-pdf-viewer/core';

import { RenderSwitchSelectionModeProps } from './SwitchSelectionMode';
import SwitchSelectionModeDecorator from './SwitchSelectionModeDecorator';

const TOOLTIP_OFFSET = { left: 0, top: 8 };

const SwitchSelectionModeButton: React.FC<RenderSwitchSelectionModeProps> = ({ isSelected, mode, onClick }) => (
    <SwitchSelectionModeDecorator mode={mode} onClick={onClick}>
        {(props) => (
            <Tooltip
                position={Position.BottomCenter}
                target={
                    <MinimalButton label={props.label} isSelected={isSelected} onClick={props.onClick}>
                        {props.icon}
                    </MinimalButton>
                }
                content={() => props.label}
                offset={TOOLTIP_OFFSET}
            />
        )}
    </SwitchSelectionModeDecorator>
);

export default SwitchSelectionModeButton;
