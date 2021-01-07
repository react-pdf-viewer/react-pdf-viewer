/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { createStore, Plugin, PluginFunctions, RenderViewer, Slot, SpecialZoomLevel } from '@react-pdf-viewer/core';

import EnterFullScreen, { EnterFullScreenProps } from './EnterFullScreen';
import EnterFullScreenButton from './EnterFullScreenButton';
import ExitFullScreenButton from './ExitFullScreenButton';
import type { Zoom } from './types';

import StoreProps from './StoreProps';

interface FullScreenPlugin extends Plugin {
    EnterFullScreen: (props: EnterFullScreenProps) => React.ReactElement;
    EnterFullScreenButton: () => React.ReactElement;
}

export interface FullScreenPluginProps {
    onEnterFullScreen?(zoom: Zoom): void;
    onExitFullScreen?(zoom: Zoom): void;
}

const fullScreenPlugin = (props?: FullScreenPluginProps): FullScreenPlugin => {
    const store = React.useMemo(() => createStore<StoreProps>({}), []);
    const onEnterFullScreen = props && props.onEnterFullScreen ? props.onEnterFullScreen : () => {};
    const onExitFullScreen = props && props.onExitFullScreen ? props.onExitFullScreen : () => {};

    const EnterFullScreenDecorator = (props: EnterFullScreenProps) => (
        <EnterFullScreen {...props} store={store} onEnterFullScreen={onEnterFullScreen} />
    );

    const EnterFullScreenButtonDecorator = () => (
        <EnterFullScreenDecorator>
            {
                (renderProps) => <EnterFullScreenButton {...renderProps} />
            }
        </EnterFullScreenDecorator>
    );

    const ExitFullScreenDecorator = () => (
        <ExitFullScreenButton store={store} onExitFullScreen={onExitFullScreen} />
    );

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
    };
};

export default fullScreenPlugin;
