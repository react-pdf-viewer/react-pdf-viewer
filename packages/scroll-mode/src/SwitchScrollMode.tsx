/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import type { Store } from '@react-pdf-viewer/core';

import { ScrollMode } from './structs/ScrollMode';
import { SwitchScrollModeButton } from './SwitchScrollModeButton';
import { useScrollMode } from './useScrollMode';
import type { RenderSwitchScrollModeProps } from './types/RenderSwitchScrollModeProps';
import type { StoreProps } from './types/StoreProps';

type RenderSwitchScrollMode = (props: RenderSwitchScrollModeProps) => React.ReactElement;

export interface SwitchScrollModeProps {
    children?: RenderSwitchScrollMode;
    mode: ScrollMode;
}

export const SwitchScrollMode: React.FC<{
    children?: RenderSwitchScrollMode;
    mode: ScrollMode;
    store: Store<StoreProps>;
}> = ({ children, mode, store }) => {
    const { scrollMode, switchTo } = useScrollMode(store);

    const onClick = () => switchTo(mode);

    const isSelected = scrollMode === mode;

    const defaultChildren = (props: RenderSwitchScrollModeProps) => (
        <SwitchScrollModeButton isSelected={isSelected} mode={props.mode} onClick={props.onClick} />
    );
    const render = children || defaultChildren;

    return render({
        isSelected,
        mode,
        onClick,
    });
};
