/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { ReactElement } from 'react';
import { createStore, Plugin, PluginFunctions, ViewerState } from '@phuocng/rpv';

import CurrentScale, { CurrentScaleProps } from './CurrentScale';
import ZoomIn, { ZoomInProps } from './ZoomIn';
import ZoomOut, { ZoomOutProps } from './ZoomOut';
import ZoomInButton from './ZoomInButton';
import ZoomOutButton from './ZoomOutButton';

import StoreProps from './StoreProps';

interface ZoomPlugin extends Plugin {
    CurrentScale: (props: CurrentScaleProps) => ReactElement;
    ZoomIn: (props: ZoomInProps) => ReactElement;
    ZoomInButton: () => ReactElement;
    ZoomOut: (props: ZoomOutProps) => ReactElement;
    ZoomOutButton: () => ReactElement;
}

const zoomPlugin = (): ZoomPlugin => {
    const store = createStore<StoreProps>({});

    const CurrentScaleDecorator = (props: CurrentScaleProps) => (
        <CurrentScale {...props} store={store} />
    );

    const ZoomInDecorator = (props: ZoomInProps) => (
        <ZoomIn {...props} store={store} />
    );

    const ZoomInButtonDecorator = () => (
        <ZoomInDecorator>
            {props => <ZoomInButton {...props} />}
        </ZoomInDecorator>
    );

    const ZoomOutDecorator = (props: ZoomOutProps) => (
        <ZoomOut {...props} store={store} />
    );

    const ZoomOutButtonDecorator = () => (
        <ZoomOutDecorator>
            {props => <ZoomOutButton {...props} />}
        </ZoomOutDecorator>
    );

    return {
        install: (pluginFunctions: PluginFunctions) => {
            store.update('zoom', pluginFunctions.zoom);
        },
        onViewerStateChange: (viewerState: ViewerState) => {
            store.update('scale', viewerState.scale);
            return viewerState;
        },
        CurrentScale: CurrentScaleDecorator,
        ZoomIn: ZoomInDecorator,
        ZoomInButton: ZoomInButtonDecorator,
        ZoomOut: ZoomOutDecorator,
        ZoomOutButton: ZoomOutButtonDecorator,
    };
};

export default zoomPlugin;
