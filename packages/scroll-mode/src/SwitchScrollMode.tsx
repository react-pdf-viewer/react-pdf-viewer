/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Store } from '@react-pdf-viewer/core';

import ScrollMode from './ScrollMode';
import StoreProps from './StoreProps';
import SwitchScrollModeButton from './SwitchScrollModeButton';
import useScrollMode from './useScrollMode';

export interface RenderSwitchScrollModeProps {
    isSelected: boolean;
    mode: ScrollMode;
    onClick(): void;
}

type RenderSwitchScrollMode = (props: RenderSwitchScrollModeProps) => React.ReactElement;

export interface SwitchScrollModeProps {
    children?: RenderSwitchScrollMode;
    mode: ScrollMode;
}

const SwitchScrollMode: React.FC<{
    children?: RenderSwitchScrollMode,
    mode: ScrollMode,
    store: Store<StoreProps>,
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

export default SwitchScrollMode;
