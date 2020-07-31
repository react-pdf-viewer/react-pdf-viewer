/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { FC } from 'react';
import { MenuItem } from '@phuocng/rpv';

import { RenderSwitchSelectionModeProps } from './SwitchSelectionMode';
import SwitchSelectionModeDecorator from './SwitchSelectionModeDecorator';

const SwitchSelectionModeMenuItem: FC<RenderSwitchSelectionModeProps> = ({ isSelected, mode, onClick }) => (
    <SwitchSelectionModeDecorator mode={mode} onClick={onClick}>
        {
            (props) => (
                <MenuItem
                    checked={isSelected}
                    icon={props.icon}
                    onClick={props.onClick}
                >
                    {props.label}
                </MenuItem>
            )
        }
    </SwitchSelectionModeDecorator>
);

export default SwitchSelectionModeMenuItem;
