/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { ReactElement } from 'react';
import { createStore, Plugin, PluginFunctions, RenderViewer, Slot } from '@phuocng/rpv';

import EnterFullScreen, { EnterFullScreenProps } from './EnterFullScreen';
import EnterFullScreenButton from './EnterFullScreenButton';
import ExitFullScreenButton from './ExitFullScreenButton';

import StoreProps from './StoreProps';

interface FullScreenPlugin extends Plugin {
    EnterFullScreen: (props: EnterFullScreenProps) => ReactElement;
    EnterFullScreenButton: () => ReactElement;
}

const fullScreenPlugin = (): FullScreenPlugin => {
    const store = createStore<StoreProps>({});

    const EnterFullScreenDecorator = (props: EnterFullScreenProps) => (
        <EnterFullScreen {...props} store={store} />
    );

    const EnterFullScreenButtonDecorator = () => (
        <EnterFullScreenDecorator>
            {
                (props) => <EnterFullScreenButton {...props} />
            }
        </EnterFullScreenDecorator>
    );

    const ExitFullScreenDecorator = () => (
        <ExitFullScreenButton store={store} />
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
            store.update('getPagesRef', pluginFunctions.getPagesRef);
        },
        renderViewer,
        EnterFullScreen: EnterFullScreenDecorator,
        EnterFullScreenButton: EnterFullScreenButtonDecorator,
    };
};

export default fullScreenPlugin;
