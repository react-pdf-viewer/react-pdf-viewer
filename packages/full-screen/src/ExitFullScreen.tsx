/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import type { Store } from '@react-pdf-viewer/core';

import { ExitFullScreenButton } from './ExitFullScreenButton';
import { useEnterFullScreen } from './useEnterFullScreen';
import type { StoreProps } from './types/StoreProps';
import type { Zoom } from './types/Zoom';

export interface RenderExitFullScreenProps {
    onClick(): void;
}

type RenderExitFullScreen = (props: RenderExitFullScreenProps) => React.ReactElement;

export interface ExitFullScreenProps {
    children?: RenderExitFullScreen;
}

export const ExitFullScreen: React.FC<{
    children?: RenderExitFullScreen;
    getFullScreenTarget(pagesContainer: HTMLElement): HTMLElement;
    store: Store<StoreProps>;
    onEnterFullScreen(zoom: Zoom): void;
    onExitFullScreen(zoom: Zoom): void;
}> = ({ children, getFullScreenTarget, store, onEnterFullScreen, onExitFullScreen }) => {
    const { enterFullScreen, exitFullScreen, isFullScreen } = useEnterFullScreen(
        getFullScreenTarget,
        store,
        onEnterFullScreen,
        onExitFullScreen
    );

    const defaultChildren = (props: RenderExitFullScreenProps) => <ExitFullScreenButton onClick={props.onClick} />;
    const render = children || defaultChildren;

    return (
        isFullScreen &&
        render({
            onClick: isFullScreen ? exitFullScreen : enterFullScreen,
        })
    );
};
