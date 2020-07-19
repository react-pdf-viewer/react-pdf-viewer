/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';
import { createStore, Plugin, PluginFunctions } from '@phuocng/rpv';

import OpenButton, { OpenButtonProps } from './OpenButton';

import StoreProps from './StoreProps';

interface OpenPlugin extends Plugin {
    OpenButton: (props: OpenButtonProps) => React.ReactElement;
}

const previousPagePlugin = (): OpenPlugin => {
    const store = createStore<StoreProps>({});

    const OpenButtonDecorator = (props: OpenButtonProps) => (
        <OpenButton {...props} store={store} />
    );

    return {
        install: (pluginFunctions: PluginFunctions) => {
            store.update('openFile', pluginFunctions.openFile);
        },
        OpenButton: OpenButtonDecorator,
    };
};

export default previousPagePlugin;
