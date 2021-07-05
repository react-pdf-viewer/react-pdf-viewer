/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { createStore, Plugin, PluginFunctions, ViewerState } from '@react-pdf-viewer/core';

import Rotate, { RotateProps } from './Rotate';
import RotateButton from './RotateButton';
import RotateMenuItem from './RotateMenuItem';
import RotateDirection from './RotateDirection';
import StoreProps from './StoreProps';

export interface RotateDecoratorProps {
    onClick(): void;
}

export interface RotatePlugin extends Plugin {
    Rotate(props: RotateProps): React.ReactElement;
    RotateBackwardButton(): React.ReactElement;
    RotateBackwardMenuItem(props: RotateDecoratorProps): React.ReactElement;
    RotateForwardButton(): React.ReactElement;
    RotateForwardMenuItem(props: RotateDecoratorProps): React.ReactElement;
}

const rotatePlugin = (): RotatePlugin => {
    const store = React.useMemo(
        () =>
            createStore<StoreProps>({
                rotation: 0,
            }),
        []
    );

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

    return {
        install: (pluginFunctions: PluginFunctions) => {
            store.update('rotate', pluginFunctions.rotate);
        },
        onViewerStateChange: (viewerState: ViewerState) => {
            store.update('rotation', viewerState.rotation);
            return viewerState;
        },
        Rotate: RotateDecorator,
        RotateBackwardButton: RotateBackwardButtonDecorator,
        RotateBackwardMenuItem: RotateBackwardMenuItemDecorator,
        RotateForwardButton: RotateForwardButtonDecorator,
        RotateForwardMenuItem: RotateForwardMenuItemDecorator,
    };
};

export default rotatePlugin;
