/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { ReactElement } from 'react';
import { createStore, Plugin, PluginFunctions } from '@phuocng/rpv';

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
                (props) => (
                    <>
                        <EnterFullScreenButton {...props} />
                        {props.isFullScreen && <ExitFullScreenButton {...props} />}
                    </>
                )
            }
        </EnterFullScreenDecorator>
    );

    return {
        install: (pluginFunctions: PluginFunctions) => {
            store.update('getPagesRef', pluginFunctions.getPagesRef);
        },
        EnterFullScreen: EnterFullScreenDecorator,
        EnterFullScreenButton: EnterFullScreenButtonDecorator,
    };
};

export default fullScreenPlugin;
