/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { ReactElement } from 'react';
import { createStore, Plugin, PluginFunctions } from '@react-pdf-viewer/core';

import Open, { OpenProps } from './Open';

import StoreProps from './StoreProps';

interface OpenPlugin extends Plugin {
    Open: (props: OpenProps) => ReactElement;
    OpenButton: () => ReactElement;
}

const openPlugin = (): OpenPlugin => {
    const store = createStore<StoreProps>({});

    const OpenDecorator = (props: OpenProps) => (
        <Open {...props} store={store} />
    );

    const OpenButtonDecorator = () => <OpenDecorator />;

    return {
        install: (pluginFunctions: PluginFunctions) => {
            store.update('openFile', pluginFunctions.openFile);
        },
        Open: OpenDecorator,
        OpenButton: OpenButtonDecorator,
    };
};

export default openPlugin;
