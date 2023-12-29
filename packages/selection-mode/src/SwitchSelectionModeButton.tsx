/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import { MinimalButton, Position, Tooltip } from '@react-pdf-viewer/core';
import * as React from 'react';
import { SwitchSelectionModeDecorator } from './SwitchSelectionModeDecorator';
import { SelectionMode } from './structs/SelectionMode';
import { RenderSwitchSelectionModeProps } from './types/RenderSwitchSelectionModeProps';

export const SwitchSelectionModeButton: React.FC<RenderSwitchSelectionModeProps> = ({ isSelected, mode, onClick }) => {
    let testId = '';
    switch (mode) {
        case SelectionMode.Hand:
            testId = 'selection-mode__hand-button';
            break;
        case SelectionMode.Text:
        default:
            testId = 'selection-mode__text-button';
    }

    return (
        <SwitchSelectionModeDecorator mode={mode} onClick={onClick}>
            {(props) => (
                <Tooltip
                    ariaControlsSuffix="selection-mode-switch"
                    position={Position.BottomCenter}
                    target={
                        <MinimalButton
                            ariaLabel={props.label}
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
        </SwitchSelectionModeDecorator>
    );
};
