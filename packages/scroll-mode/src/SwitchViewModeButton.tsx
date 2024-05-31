/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import { MinimalButton, Position, Tooltip, ViewMode } from '@react-pdf-viewer/core';
import * as React from 'react';
import { SwitchViewModeDecorator } from './SwitchViewModeDecorator';
import { type RenderSwitchViewModeProps } from './types/RenderSwitchViewModeProps';

export const SwitchViewModeButton: React.FC<RenderSwitchViewModeProps> = ({
    isDisabled,
    isSelected,
    mode,
    onClick,
}) => {
    let testId = '';
    switch (mode) {
        case ViewMode.DualPage:
            testId = 'view-mode__dual-button';
            break;
        case ViewMode.DualPageWithCover:
            testId = 'view-mode__dual-cover-button';
            break;
        case ViewMode.SinglePage:
        default:
            testId = 'view-mode__single-button';
            break;
    }

    return (
        <SwitchViewModeDecorator mode={mode} onClick={onClick}>
            {(props) => (
                <Tooltip
                    ariaControlsSuffix="view-mode-switch"
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
        </SwitchViewModeDecorator>
    );
};
