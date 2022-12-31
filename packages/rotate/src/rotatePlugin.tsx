/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { Plugin, PluginFunctions } from '@react-pdf-viewer/core';
import { createStore, RotateDirection } from '@react-pdf-viewer/core';
import * as React from 'react';
import { Rotate, RotateProps } from './Rotate';
import { RotateButton } from './RotateButton';
import { RotateMenuItem } from './RotateMenuItem';
import { RotatePage, RotatePageProps } from './RotatePage';
import type { StoreProps } from './types/StoreProps';

export interface RotateDecoratorProps {
    onClick(): void;
}

export interface RotatePlugin extends Plugin {
    Rotate(props: RotateProps): React.ReactElement;
    RotatePage(props: RotatePageProps): React.ReactElement;
    RotateBackwardButton(): React.ReactElement;
    RotateBackwardMenuItem(props: RotateDecoratorProps): React.ReactElement;
    RotateForwardButton(): React.ReactElement;
    RotateForwardMenuItem(props: RotateDecoratorProps): React.ReactElement;
}

export const rotatePlugin = (): RotatePlugin => {
    const store = React.useMemo(() => createStore<StoreProps>(), []);

    const RotateDecorator = (props: RotateProps) => <Rotate {...props} store={store} />;

    const RotateBackwardButtonDecorator = () => (
        <RotateDecorator direction={RotateDirection.Backward}>{(props) => <RotateButton {...props} />}</RotateDecorator>
    );

    const RotateBackwardMenuItemDecorator = (props: RotateDecoratorProps) => (
        <RotateDecorator direction={RotateDirection.Backward}>
            {(p) => (
                <RotateMenuItem
                    direction={p.direction}
                    onClick={() => {
                        p.onClick();
                        props.onClick();
                    }}
                />
            )}
        </RotateDecorator>
    );

    const RotateForwardButtonDecorator = () => (
        <RotateDecorator direction={RotateDirection.Forward}>{(props) => <RotateButton {...props} />}</RotateDecorator>
    );

    const RotateForwardMenuItemDecorator = (props: RotateDecoratorProps) => (
        <RotateDecorator direction={RotateDirection.Forward}>
            {(p) => (
                <RotateMenuItem
                    direction={p.direction}
                    onClick={() => {
                        p.onClick();
                        props.onClick();
                    }}
                />
            )}
        </RotateDecorator>
    );

    const RotatePageDecorator = (props: RotatePageProps) => <RotatePage {...props} store={store} />;

    return {
        install: (pluginFunctions: PluginFunctions) => {
            store.update('rotate', pluginFunctions.rotate);
            store.update('rotatePage', pluginFunctions.rotatePage);
        },
        Rotate: RotateDecorator,
        RotateBackwardButton: RotateBackwardButtonDecorator,
        RotateBackwardMenuItem: RotateBackwardMenuItemDecorator,
        RotateForwardButton: RotateForwardButtonDecorator,
        RotateForwardMenuItem: RotateForwardMenuItemDecorator,
        RotatePage: RotatePageDecorator,
    };
};
