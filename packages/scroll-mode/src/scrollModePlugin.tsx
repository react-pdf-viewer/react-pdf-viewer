/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { Plugin, PluginFunctions, ViewerState } from '@react-pdf-viewer/core';
import { createStore, ScrollMode, ViewMode } from '@react-pdf-viewer/core';
import * as React from 'react';
import { SwitchScrollMode, SwitchScrollModeProps } from './SwitchScrollMode';
import { switchScrollMode } from './switchScrollMode';
import { SwitchScrollModeButton } from './SwitchScrollModeButton';
import { SwitchScrollModeMenuItem } from './SwitchScrollModeMenuItem';
import { SwitchViewMode, SwitchViewModeProps } from './SwitchViewMode';
import { switchViewMode } from './switchViewMode';
import { SwitchViewModeButton } from './SwitchViewModeButton';
import { SwitchViewModeMenuItem } from './SwitchViewModeMenuItem';
import type { StoreProps } from './types/StoreProps';

export interface SwitchScrollModeButtonProps {
    mode: ScrollMode;
}

export interface SwitchScrollModeMenuItemProps {
    mode: ScrollMode;
    onClick(): void;
}

export interface SwitchViewModeButtonProps {
    mode: ViewMode;
}

export interface SwitchViewModeMenuItemProps {
    mode: ViewMode;
    onClick(): void;
}

export interface ScrollModePlugin extends Plugin {
    switchScrollMode(mode: ScrollMode): void;
    SwitchScrollMode(props: SwitchScrollModeProps): React.ReactElement;
    SwitchScrollModeButton(props: SwitchScrollModeButtonProps): React.ReactElement;
    SwitchScrollModeMenuItem(props: SwitchScrollModeMenuItemProps): React.ReactElement;

    switchViewMode(mode: ViewMode): void;
    SwitchViewMode(props: SwitchViewModeProps): React.ReactElement;
    SwitchViewModeButton(props: SwitchViewModeButtonProps): React.ReactElement;
    SwitchViewModeMenuItem(props: SwitchViewModeMenuItemProps): React.ReactElement;
}

export const scrollModePlugin = (): ScrollModePlugin => {
    const store = React.useMemo(
        () =>
            createStore<StoreProps>({
                scrollMode: ScrollMode.Vertical,
                viewMode: ViewMode.SinglePage,
                switchScrollMode: () => {
                    /**/
                },
                switchViewMode: () => {
                    /**/
                },
            }),
        []
    );

    const SwitchScrollModeDecorator = (props: SwitchScrollModeProps) => <SwitchScrollMode {...props} store={store} />;

    const SwitchScrollModeButtonDecorator = (props: SwitchScrollModeButtonProps) => (
        <SwitchScrollModeDecorator mode={props.mode}>
            {(p) => (
                <SwitchScrollModeButton
                    isDisabled={p.isDisabled}
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
                    isDisabled={p.isDisabled}
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

    // Switch the view mode components
    const SwitchViewModeDecorator = (props: SwitchViewModeProps) => <SwitchViewMode {...props} store={store} />;

    const SwitchViewModeButtonDecorator = (props: SwitchViewModeButtonProps) => (
        <SwitchViewModeDecorator mode={props.mode}>
            {(p) => (
                <SwitchViewModeButton
                    isDisabled={p.isDisabled}
                    isSelected={p.isSelected}
                    mode={p.mode}
                    onClick={() => {
                        p.onClick();
                    }}
                />
            )}
        </SwitchViewModeDecorator>
    );

    const SwitchViewModeMenuItemDecorator = (props: SwitchViewModeMenuItemProps) => (
        <SwitchViewModeDecorator mode={props.mode}>
            {(p) => (
                <SwitchViewModeMenuItem
                    isDisabled={p.isDisabled}
                    isSelected={p.isSelected}
                    mode={p.mode}
                    onClick={() => {
                        p.onClick();
                        props.onClick();
                    }}
                />
            )}
        </SwitchViewModeDecorator>
    );

    return {
        install: (pluginFunctions: PluginFunctions) => {
            store.update('switchScrollMode', pluginFunctions.switchScrollMode);
            store.update('switchViewMode', pluginFunctions.switchViewMode);
        },
        // Plugin functions
        onViewerStateChange: (viewerState: ViewerState) => {
            store.update('scrollMode', viewerState.scrollMode);
            store.update('viewMode', viewerState.viewMode);
            return viewerState;
        },
        switchScrollMode: (scrollMode: ScrollMode) => {
            switchScrollMode(store, scrollMode);
        },
        switchViewMode: (viewMode: ViewMode) => {
            switchViewMode(store, viewMode);
        },
        SwitchScrollMode: SwitchScrollModeDecorator,
        SwitchScrollModeButton: SwitchScrollModeButtonDecorator,
        SwitchScrollModeMenuItem: SwitchScrollModeMenuItemDecorator,
        SwitchViewMode: SwitchViewModeDecorator,
        SwitchViewModeButton: SwitchViewModeButtonDecorator,
        SwitchViewModeMenuItem: SwitchViewModeMenuItemDecorator,
    };
};
