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
import { EnterFullScreenButton } from './EnterFullScreenButton';
import { EnterFullScreenMenuItem, EnterFullScreenMenuItemProps } from './EnterFullScreenMenuItem';
import { ExitFullScreenButton } from './ExitFullScreenButton';
import type { StoreProps } from './types/StoreProps';
import type { Zoom } from './types/Zoom';

// Export types
export type { EnterFullScreenMenuItemProps, EnterFullScreenProps };

export interface FullScreenPlugin extends Plugin {
    EnterFullScreen: (props: EnterFullScreenProps) => React.ReactElement;
    EnterFullScreenButton: () => React.ReactElement;
    EnterFullScreenMenuItem: (props: EnterFullScreenMenuItemProps) => React.ReactElement;
}

export interface FullScreenPluginProps {
    onEnterFullScreen?(zoom: Zoom): void;
    onExitFullScreen?(zoom: Zoom): void;
}

export const fullScreenPlugin = (props?: FullScreenPluginProps): FullScreenPlugin => {
    const store = React.useMemo(() => createStore<StoreProps>({}), []);

    /* eslint-disable @typescript-eslint/no-empty-function */
    const onEnterFullScreen = props && props.onEnterFullScreen ? props.onEnterFullScreen : () => {};
    const onExitFullScreen = props && props.onExitFullScreen ? props.onExitFullScreen : () => {};
    /* eslint-enable @typescript-eslint/no-empty-function */

    const EnterFullScreenDecorator = (props: EnterFullScreenProps) => (
        <EnterFullScreen
            {...props}
            store={store}
            onEnterFullScreen={onEnterFullScreen}
            onExitFullScreen={onExitFullScreen}
        />
    );

    const EnterFullScreenButtonDecorator = () => (
        <EnterFullScreenDecorator>
            {(renderProps) => <EnterFullScreenButton {...renderProps} />}
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

    const ExitFullScreenDecorator = () => <ExitFullScreenButton store={store} />;

    const renderViewer = (props: RenderViewer): Slot => {
        const currentSlot = props.slot;
        if (currentSlot.subSlot) {
            currentSlot.subSlot.children = (
                <>
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
