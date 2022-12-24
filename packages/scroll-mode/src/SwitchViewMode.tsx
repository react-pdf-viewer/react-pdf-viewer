/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { Store } from '@react-pdf-viewer/core';
import { ViewMode } from '@react-pdf-viewer/core';
import * as React from 'react';
import { SwitchViewModeButton } from './SwitchViewModeButton';
import type { RenderSwitchViewModeProps } from './types/RenderSwitchViewModeProps';
import type { StoreProps } from './types/StoreProps';
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

    const onClick = () => {
        store.get('switchViewMode')(mode);
    };

    const isSelected = viewMode === mode;

    const defaultChildren = (props: RenderSwitchViewModeProps) => (
        <SwitchViewModeButton isSelected={isSelected} mode={props.mode} onClick={props.onClick} />
    );
    const render = children || defaultChildren;

    return render({
        isSelected,
        mode,
        onClick,
    });
};
