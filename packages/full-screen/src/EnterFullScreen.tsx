/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { Store } from '@react-pdf-viewer/core';
import * as React from 'react';
import { EnterFullScreenButton } from './EnterFullScreenButton';
import { ExitFullScreenButtonWithTooltip } from './ExitFullScreenButtonWithTooltip';
import type { StoreProps } from './types/StoreProps';
import type { Zoom } from './types/Zoom';
import { useEnterFullScreen } from './useEnterFullScreen';

export interface RenderEnterFullScreenProps {
    onClick(): void;
}

type RenderEnterFullScreen = (props: RenderEnterFullScreenProps) => React.ReactElement;

export interface EnterFullScreenProps {
    children?: RenderEnterFullScreen;
}

export const EnterFullScreen: React.FC<{
    children?: RenderEnterFullScreen;
    enableShortcuts: boolean;
    getFullScreenTarget(pagesContainer: HTMLElement): HTMLElement;
    store: Store<StoreProps>;
    onEnterFullScreen(zoom: Zoom): void;
    onExitFullScreen(zoom: Zoom): void;
}> = ({ children, enableShortcuts, getFullScreenTarget, store, onEnterFullScreen, onExitFullScreen }) => {
    const { enterFullScreen, exitFullScreen, isFullScreen } = useEnterFullScreen(
        getFullScreenTarget,
        store,
        onEnterFullScreen,
        onExitFullScreen
    );

    const defaultChildren = (props: RenderEnterFullScreenProps) =>
        isFullScreen ? (
            <ExitFullScreenButtonWithTooltip onClick={props.onClick} />
        ) : (
            <EnterFullScreenButton enableShortcuts={enableShortcuts} onClick={props.onClick} />
        );
    const render = children || defaultChildren;

    return render({
        onClick: isFullScreen ? exitFullScreen : enterFullScreen,
    });
};
