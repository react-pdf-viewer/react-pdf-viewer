/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import { createStore, type Plugin, type PluginFunctions, type RenderViewer, type Slot } from '@react-pdf-viewer/core';
import * as React from 'react';
import { Open, OpenProps } from './Open';
import { OpenMenuItem } from './OpenMenuItem';
import { ShortcutHandler } from './ShortcutHandler';
import { type StoreProps } from './types/StoreProps';

export interface OpenPlugin extends Plugin {
    Open: (props: OpenProps) => React.ReactElement;
    OpenButton: () => React.ReactElement;
    OpenMenuItem: () => React.ReactElement;
}

export interface OpenPluginProps {
    enableShortcuts?: boolean;
}

export const openPlugin = (props?: OpenPluginProps): OpenPlugin => {
    const openPluginProps = React.useMemo(() => Object.assign({}, { enableShortcuts: true }, props), []);
    const store = React.useMemo(() => createStore<StoreProps>({}), []);

    const OpenDecorator = (props: OpenProps) => (
        <Open enableShortcuts={openPluginProps.enableShortcuts} {...props} store={store} />
    );

    const OpenButtonDecorator = () => <OpenDecorator />;

    const OpenMenuItemDecorator = () => (
        <OpenDecorator>{(p) => <OpenMenuItem store={store} onClick={p.onClick} />}</OpenDecorator>
    );

    const renderViewer = (props: RenderViewer): Slot => {
        const { slot } = props;
        const updateSlot: Slot = {
            children: (
                <>
                    {openPluginProps.enableShortcuts && (
                        <ShortcutHandler containerRef={props.containerRef} store={store} />
                    )}
                    {slot.children}
                </>
            ),
        };
        return { ...slot, ...updateSlot };
    };

    return {
        install: (pluginFunctions: PluginFunctions) => {
            store.update('openFile', pluginFunctions.openFile);
        },
        renderViewer,
        Open: OpenDecorator,
        OpenButton: OpenButtonDecorator,
        OpenMenuItem: OpenMenuItemDecorator,
    };
};
