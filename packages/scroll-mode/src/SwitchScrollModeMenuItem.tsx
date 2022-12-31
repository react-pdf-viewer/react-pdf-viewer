/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { MenuItem, ScrollMode } from '@react-pdf-viewer/core';
import * as React from 'react';
import { SwitchScrollModeDecorator } from './SwitchScrollModeDecorator';
import type { RenderSwitchScrollModeProps } from './types/RenderSwitchScrollModeProps';

export const SwitchScrollModeMenuItem: React.FC<RenderSwitchScrollModeProps> = ({
    isDisabled,
    isSelected,
    mode,
    onClick,
}) => {
    let testId = '';
    switch (mode) {
        case ScrollMode.Horizontal:
            testId = 'scroll-mode__horizontal-menu';
            break;
        case ScrollMode.Page:
            testId = 'scroll-mode__page-menu';
            break;
        case ScrollMode.Wrapped:
            testId = 'scroll-mode__wrapped-menu';
            break;
        case ScrollMode.Vertical:
        default:
            testId = 'scroll-mode__vertical-menu';
            break;
    }

    return (
        <SwitchScrollModeDecorator mode={mode} onClick={onClick}>
            {(props) => (
                <MenuItem
                    checked={isSelected}
                    icon={props.icon}
                    isDisabled={isDisabled}
                    testId={testId}
                    onClick={props.onClick}
                >
                    {props.label}
                </MenuItem>
            )}
        </SwitchScrollModeDecorator>
    );
};
