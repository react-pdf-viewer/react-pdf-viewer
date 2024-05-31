/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import { type Store } from '@react-pdf-viewer/core';
import * as React from 'react';
import { SwitchSelectionModeButton } from './SwitchSelectionModeButton';
import { SelectionMode } from './structs/SelectionMode';
import { type RenderSwitchSelectionModeProps } from './types/RenderSwitchSelectionModeProps';
import { type StoreProps } from './types/StoreProps';

type RenderSwitchSelectionMode = (props: RenderSwitchSelectionModeProps) => React.ReactElement;

export interface SwitchSelectionModeProps {
    children?: RenderSwitchSelectionMode;
    mode: SelectionMode;
}

export const SwitchSelectionMode: React.FC<{
    children?: RenderSwitchSelectionMode;
    mode: SelectionMode;
    store: Store<StoreProps>;
}> = ({ children, mode, store }) => {
    const onClick = () => store.update('selectionMode', mode);

    const isSelected = mode === store.get('selectionMode');

    const defaultChildren = (props: RenderSwitchSelectionModeProps) => (
        <SwitchSelectionModeButton isSelected={isSelected} mode={props.mode} onClick={props.onClick} />
    );
    const render = children || defaultChildren;

    return render({
        isSelected,
        mode,
        onClick,
    });
};
