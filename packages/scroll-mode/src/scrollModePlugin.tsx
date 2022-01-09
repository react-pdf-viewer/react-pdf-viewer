/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { createStore, ScrollMode } from '@react-pdf-viewer/core';
import type { Plugin, PluginFunctions } from '@react-pdf-viewer/core';

import { SwitchScrollMode, SwitchScrollModeProps } from './SwitchScrollMode';
import { SwitchScrollModeButton } from './SwitchScrollModeButton';
import { SwitchScrollModeMenuItem } from './SwitchScrollModeMenuItem';
import type { StoreProps } from './types/StoreProps';

export interface SwitchScrollModeButtonProps {
    mode: ScrollMode;
}

export interface SwitchScrollModeMenuItemProps {
    mode: ScrollMode;
    onClick(): void;
}

export interface ScrollModePlugin extends Plugin {
    switchScrollMode(mode: ScrollMode): void;
    SwitchScrollMode(props: SwitchScrollModeProps): React.ReactElement;
    SwitchScrollModeButton(props: SwitchScrollModeButtonProps): React.ReactElement;
    SwitchScrollModeMenuItem(props: SwitchScrollModeMenuItemProps): React.ReactElement;
}

export const scrollModePlugin = (): ScrollModePlugin => {
    const store = React.useMemo(
        () =>
            createStore<StoreProps>({
                scrollMode: ScrollMode.Vertical,
                switchScrollMode: () => {},
            }),
        []
    );

    const SwitchScrollModeDecorator = (props: SwitchScrollModeProps) => <SwitchScrollMode {...props} store={store} />;

    const SwitchScrollModeButtonDecorator = (props: SwitchScrollModeButtonProps) => (
        <SwitchScrollModeDecorator mode={props.mode}>
            {(p) => (
                <SwitchScrollModeButton
                    isSelected={p.isSelected}
                    mode={p.mode}
                    onClick={() => {
                        p.onClick();
                    }}
                />
            )}
        </SwitchScrollModeDecorator>
    );

    const SwitchScrollModeMenuItemDecorator = (props: SwitchScrollModeMenuItemProps) => (
        <SwitchScrollModeDecorator mode={props.mode}>
            {(p) => (
                <SwitchScrollModeMenuItem
                    isSelected={p.isSelected}
                    mode={p.mode}
                    onClick={() => {
                        p.onClick();
                        props.onClick();
                    }}
                />
            )}
        </SwitchScrollModeDecorator>
    );

    return {
        install: (pluginFunctions: PluginFunctions) => {
            store.update('switchScrollMode', pluginFunctions.switchScrollMode);
        },
        // Plugin functions
        switchScrollMode: (mode: ScrollMode) => {
            store.update('scrollMode', mode);
            store.get('switchScrollMode')(mode);
        },
        SwitchScrollMode: SwitchScrollModeDecorator,
        SwitchScrollModeButton: SwitchScrollModeButtonDecorator,
        SwitchScrollModeMenuItem: SwitchScrollModeMenuItemDecorator,
    };
};
