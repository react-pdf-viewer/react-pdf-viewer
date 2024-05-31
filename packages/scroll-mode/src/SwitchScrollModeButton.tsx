/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import { MinimalButton, Position, ScrollMode, Tooltip } from '@react-pdf-viewer/core';
import * as React from 'react';
import { SwitchScrollModeDecorator } from './SwitchScrollModeDecorator';
import { type RenderSwitchScrollModeProps } from './types/RenderSwitchScrollModeProps';

export const SwitchScrollModeButton: React.FC<RenderSwitchScrollModeProps> = ({
    isDisabled,
    isSelected,
    mode,
    onClick,
}) => {
    let testId = '';
    switch (mode) {
        case ScrollMode.Horizontal:
            testId = 'scroll-mode__horizontal-button';
            break;
        case ScrollMode.Page:
            testId = 'scroll-mode__page-button';
            break;
        case ScrollMode.Wrapped:
            testId = 'scroll-mode__wrapped-button';
            break;
        case ScrollMode.Vertical:
        default:
            testId = 'scroll-mode__vertical-button';
            break;
    }

    return (
        <SwitchScrollModeDecorator mode={mode} onClick={onClick}>
            {(props) => (
                <Tooltip
                    ariaControlsSuffix="scroll-mode-switch"
                    position={Position.BottomCenter}
                    target={
                        <MinimalButton
                            ariaLabel={props.label}
                            isDisabled={isDisabled}
                            isSelected={isSelected}
                            testId={testId}
                            onClick={props.onClick}
                        >
                            {props.icon}
                        </MinimalButton>
                    }
                    content={() => props.label}
                />
            )}
        </SwitchScrollModeDecorator>
    );
};
