/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { Plugin, PluginFunctions, RenderViewer, Slot, ViewerState } from '@react-pdf-viewer/core';
import { createStore, FullScreenMode } from '@react-pdf-viewer/core';
import * as React from 'react';
import { EnterFullScreen, EnterFullScreenProps } from './EnterFullScreen';
import { EnterFullScreenButton } from './EnterFullScreenButton';
import { EnterFullScreenMenuItem, EnterFullScreenMenuItemProps } from './EnterFullScreenMenuItem';
import { ExitFullScreen, RenderExitFullScreenProps } from './ExitFullScreen';
import { FullScreenModeTracker } from './FullScreenModeTracker';
import { ShortcutHandler } from './ShortcutHandler';
import type { StoreProps } from './types/StoreProps';
import type { Zoom } from './types/Zoom';

export interface FullScreenPlugin extends Plugin {
    EnterFullScreen: (props: EnterFullScreenProps) => React.ReactElement;
    EnterFullScreenButton: () => React.ReactElement;
    EnterFullScreenMenuItem: (props: EnterFullScreenMenuItemProps) => React.ReactElement;
}

export interface FullScreenPluginProps {
    enableShortcuts?: boolean;
    getFullScreenTarget?(pagesContainer: HTMLElement): HTMLElement;
    renderExitFullScreenButton?: (props: RenderExitFullScreenProps) => React.ReactElement;
    onEnterFullScreen?(zoom: Zoom): void;
    onExitFullScreen?(zoom: Zoom): void;
}

export const fullScreenPlugin = (props?: FullScreenPluginProps): FullScreenPlugin => {
    const defaultFullScreenTarget = (ele: HTMLElement) => ele;
    const getFullScreenTarget = props?.getFullScreenTarget || defaultFullScreenTarget;

    /* eslint-disable @typescript-eslint/no-empty-function */
    const fullScreenPluginProps = React.useMemo(
        () =>
            Object.assign(
                {},
                { enableShortcuts: true, onEnterFullScreen: () => {}, onExitFullScreen: () => {} },
                props
            ),
        []
    );

    const store = React.useMemo(
        () =>
            createStore<StoreProps>({
                enterFullScreenMode: () => {},
                exitFullScreenMode: () => {},
                fullScreenMode: FullScreenMode.Normal,
                zoom: () => {},
            }),
        []
    );
    /* eslint-enable @typescript-eslint/no-empty-function */

    const EnterFullScreenDecorator = (props: EnterFullScreenProps) => (
        <EnterFullScreen
            {...props}
            enableShortcuts={fullScreenPluginProps.enableShortcuts}
            getFullScreenTarget={getFullScreenTarget}
            store={store}
        />
    );

    const EnterFullScreenButtonDecorator = () => (
        <EnterFullScreenDecorator>
            {(renderProps) => (
                <EnterFullScreenButton enableShortcuts={fullScreenPluginProps.enableShortcuts} {...renderProps} />
            )}
        </EnterFullScreenDecorator>
    );

    const EnterFullScreenMenuItemDecorator = (props: EnterFullScreenMenuItemProps) => (
        <EnterFullScreenDecorator>
            {(p) => (
                <EnterFullScreenMenuItem
                    onClick={() => {
                        p.onClick();
                        props.onClick();
                    }}
                />
            )}
        </EnterFullScreenDecorator>
    );

    const ExitFullScreenDecorator = () => (
        <ExitFullScreen getFullScreenTarget={getFullScreenTarget} store={store}>
            {props?.renderExitFullScreenButton}
        </ExitFullScreen>
    );

    const renderViewer = (props: RenderViewer): Slot => {
        const currentSlot = props.slot;
        if (currentSlot.subSlot) {
            currentSlot.subSlot.children = (
                <>
                    {fullScreenPluginProps.enableShortcuts && (
                        <ShortcutHandler
                            containerRef={props.containerRef}
                            getFullScreenTarget={getFullScreenTarget}
                            store={store}
                        />
                    )}
                    <FullScreenModeTracker
                        store={store}
                        onEnterFullScreen={fullScreenPluginProps.onEnterFullScreen}
                        onExitFullScreen={fullScreenPluginProps.onExitFullScreen}
                    />
                    <ExitFullScreenDecorator />
                    {currentSlot.subSlot.children}
                </>
            );
        }

        return currentSlot;
    };

    return {
        install: (pluginFunctions: PluginFunctions) => {
            store.update('enterFullScreenMode', pluginFunctions.enterFullScreenMode);
            store.update('exitFullScreenMode', pluginFunctions.exitFullScreenMode);
            store.update('getPagesContainer', pluginFunctions.getPagesContainer);
            store.update('zoom', pluginFunctions.zoom);
        },
        onViewerStateChange: (viewerState: ViewerState) => {
            store.update('fullScreenMode', viewerState.fullScreenMode);
            return viewerState;
        },
        renderViewer,
        EnterFullScreen: EnterFullScreenDecorator,
        EnterFullScreenButton: EnterFullScreenButtonDecorator,
        EnterFullScreenMenuItem: EnterFullScreenMenuItemDecorator,
    };
};
