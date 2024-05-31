/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import { ScrollMode, ViewMode, type Store } from '@react-pdf-viewer/core';
import * as React from 'react';
import { SwitchViewModeButton } from './SwitchViewModeButton';
import { switchViewMode } from './switchViewMode';
import { type RenderSwitchViewModeProps } from './types/RenderSwitchViewModeProps';
import { type StoreProps } from './types/StoreProps';
import { useScrollMode } from './useScrollMode';
import { useViewMode } from './useViewMode';

type RenderSwitchViewMode = (props: RenderSwitchViewModeProps) => React.ReactElement;

export interface SwitchViewModeProps {
    children?: RenderSwitchViewMode;
    mode: ViewMode;
}

export const SwitchViewMode: React.FC<{
    children?: RenderSwitchViewMode;
    mode: ViewMode;
    store: Store<StoreProps>;
}> = ({ children, mode, store }) => {
    const { viewMode } = useViewMode(store);
    const { scrollMode } = useScrollMode(store);

    const onClick = () => {
        switchViewMode(store, mode);
    };

    const isSelected = viewMode === mode;
    const isDisabled =
        (scrollMode === ScrollMode.Horizontal || scrollMode === ScrollMode.Wrapped) && mode !== ViewMode.SinglePage;

    const defaultChildren = (props: RenderSwitchViewModeProps) => (
        <SwitchViewModeButton
            isDisabled={isDisabled}
            isSelected={isSelected}
            mode={props.mode}
            onClick={props.onClick}
        />
    );
    const render = children || defaultChildren;

    return render({
        isDisabled,
        isSelected,
        mode,
        onClick,
    });
};
