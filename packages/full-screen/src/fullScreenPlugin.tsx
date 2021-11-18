/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { createStore } from '@react-pdf-viewer/core';
import type { Plugin, PluginFunctions, RenderViewer, Slot } from '@react-pdf-viewer/core';

import { EnterFullScreen, EnterFullScreenProps } from './EnterFullScreen';
import { ExitFullScreen, RenderExitFullScreenProps } from './ExitFullScreen';
import { EnterFullScreenButton } from './EnterFullScreenButton';
import { EnterFullScreenMenuItem, EnterFullScreenMenuItemProps } from './EnterFullScreenMenuItem';
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
    renderExitFullScreenButton?: (props: RenderExitFullScreenProps) => React.ReactElement;
    onEnterFullScreen?(zoom: Zoom): void;
    onExitFullScreen?(zoom: Zoom): void;
}

export const fullScreenPlugin = (props?: FullScreenPluginProps): FullScreenPlugin => {
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
    /* eslint-enable @typescript-eslint/no-empty-function */
    const store = React.useMemo(() => createStore<StoreProps>({}), []);

    const EnterFullScreenDecorator = (props: EnterFullScreenProps) => (
        <EnterFullScreen
            {...props}
            enableShortcuts={fullScreenPluginProps.enableShortcuts}
            store={store}
            onEnterFullScreen={fullScreenPluginProps.onEnterFullScreen}
            onExitFullScreen={fullScreenPluginProps.onExitFullScreen}
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

    const ExitFullScreenDecorator = () => <ExitFullScreen children={props?.renderExitFullScreenButton} store={store} />;

    const renderViewer = (props: RenderViewer): Slot => {
        const currentSlot = props.slot;
        if (currentSlot.subSlot) {
            currentSlot.subSlot.children = (
                <>
                    {fullScreenPluginProps.enableShortcuts && (
                        <ShortcutHandler
                            containerRef={props.containerRef}
                            store={store}
                            onEnterFullScreen={fullScreenPluginProps.onEnterFullScreen}
                            onExitFullScreen={fullScreenPluginProps.onExitFullScreen}
                        />
                    )}
                    <ExitFullScreenDecorator />
                    {currentSlot.subSlot.children}
                </>
            );
        }

        return currentSlot;
    };

    return {
        install: (pluginFunctions: PluginFunctions) => {
            store.update('getPagesContainer', pluginFunctions.getPagesContainer);
            store.update('zoom', pluginFunctions.zoom);
        },
        renderViewer,
        EnterFullScreen: EnterFullScreenDecorator,
        EnterFullScreenButton: EnterFullScreenButtonDecorator,
        EnterFullScreenMenuItem: EnterFullScreenMenuItemDecorator,
    };
};
