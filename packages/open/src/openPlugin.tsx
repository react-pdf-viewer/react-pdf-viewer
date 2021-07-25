/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { createStore } from '@react-pdf-viewer/core';
import type { Plugin, PluginFunctions } from '@react-pdf-viewer/core';

import { Open, OpenProps } from './Open';
import { OpenMenuItem } from './OpenMenuItem';
import type { StoreProps } from './types/StoreProps';

export interface OpenPlugin extends Plugin {
    Open: (props: OpenProps) => React.ReactElement;
    OpenButton: () => React.ReactElement;
    OpenMenuItem: () => React.ReactElement;
}

export const openPlugin = (): OpenPlugin => {
    const store = React.useMemo(() => createStore<StoreProps>({}), []);

    const OpenDecorator = (props: OpenProps) => <Open {...props} store={store} />;

    const OpenButtonDecorator = () => <OpenDecorator />;

    const OpenMenuItemDecorator = () => <OpenDecorator>{(p) => <OpenMenuItem onClick={p.onClick} />}</OpenDecorator>;

    return {
        install: (pluginFunctions: PluginFunctions) => {
            store.update('openFile', pluginFunctions.openFile);
        },
        Open: OpenDecorator,
        OpenButton: OpenButtonDecorator,
        OpenMenuItem: OpenMenuItemDecorator,
    };
};
