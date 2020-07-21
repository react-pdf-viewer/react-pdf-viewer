/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { ReactElement } from 'react';
import { createStore, Plugin, PluginFunctions, ViewerState } from '@phuocng/rpv';

import ZoomIn, { ZoomInProps } from './ZoomIn';
import ZoomInButton from './ZoomInButton';

import StoreProps from './StoreProps';

interface ZoomPlugin extends Plugin {
    ZoomIn: (props: ZoomInProps) => ReactElement;
    ZoomInButton: () => ReactElement;
}

const zoomPlugin = (): ZoomPlugin => {
    const store = createStore<StoreProps>({});

    const ZoomInDecorator = (props: ZoomInProps) => (
        <ZoomIn {...props} store={store} />
    );

    const ZoomInButtonDecorator = () => (
        <ZoomInDecorator>
            {props => <ZoomInButton {...props} />}
        </ZoomInDecorator>
    );

    return {
        install: (pluginFunctions: PluginFunctions) => {
            store.update('zoom', pluginFunctions.zoom);
        },
        onViewerStateChange: (viewerState: ViewerState) => {
            store.update('scale', viewerState.scale);
            return viewerState;
        },
        ZoomIn: ZoomInDecorator,
        ZoomInButton: ZoomInButtonDecorator,
    };
};

export default zoomPlugin;
