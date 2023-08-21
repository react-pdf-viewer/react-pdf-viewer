/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { createStore, type Plugin, type PluginFunctions, type RenderViewer, type Slot } from '@react-pdf-viewer/core';
import * as React from 'react';
import { SwitchSelectionMode, SwitchSelectionModeProps } from './SwitchSelectionMode';
import { SwitchSelectionModeButton } from './SwitchSelectionModeButton';
import { SwitchSelectionModeMenuItem } from './SwitchSelectionModeMenuItem';
import { Tracker } from './Tracker';
import { SelectionMode } from './structs/SelectionMode';
import { type StoreProps } from './types/StoreProps';

export interface SwitchSelectionModeButtonProps {
    mode: SelectionMode;
}

export interface SwitchSelectionModeMenuItemProps {
    mode: SelectionMode;
    onClick(): void;
}

export interface SelectionModePlugin extends Plugin {
    SwitchSelectionMode(props: SwitchSelectionModeProps): React.ReactElement;
    SwitchSelectionModeButton(props: SwitchSelectionModeButtonProps): React.ReactElement;
    SwitchSelectionModeMenuItem(props: SwitchSelectionModeMenuItemProps): React.ReactElement;
}

export interface SelectionModePluginProps {
    selectionMode?: SelectionMode;
}

export const selectionModePlugin = (props?: SelectionModePluginProps): SelectionModePlugin => {
    const store = React.useMemo(() => createStore<StoreProps>(), []);

    const SwitchSelectionModeDecorator = (props: SwitchSelectionModeProps) => (
        <SwitchSelectionMode {...props} store={store} />
    );

    const SwitchSelectionModeButtonDecorator = (props: SwitchSelectionModeButtonProps) => (
        <SwitchSelectionModeDecorator mode={props.mode}>
            {(p) => (
                <SwitchSelectionModeButton
                    isSelected={p.isSelected}
                    mode={p.mode}
                    onClick={() => {
                        p.onClick();
                    }}
                />
            )}
        </SwitchSelectionModeDecorator>
    );

    const SwitchSelectionModeMenuItemDecorator = (props: SwitchSelectionModeMenuItemProps) => (
        <SwitchSelectionModeDecorator mode={props.mode}>
            {(p) => (
                <SwitchSelectionModeMenuItem
                    isSelected={p.isSelected}
                    mode={p.mode}
                    onClick={() => {
                        p.onClick();
                        props.onClick();
                    }}
                />
            )}
        </SwitchSelectionModeDecorator>
    );

    const renderViewer = (props: RenderViewer): Slot => {
        const currentSlot = props.slot;
        if (currentSlot.subSlot && currentSlot.subSlot.children) {
            currentSlot.subSlot.children = (
                <>
                    <Tracker store={store} />
                    {currentSlot.subSlot.children}
                </>
            );
        }

        return currentSlot;
    };

    return {
        install: (pluginFunctions: PluginFunctions) => {
            store.update('selectionMode', props && props.selectionMode ? props.selectionMode : SelectionMode.Text);
            store.update('getPagesContainer', pluginFunctions.getPagesContainer);
        },
        renderViewer,
        SwitchSelectionMode: SwitchSelectionModeDecorator,
        SwitchSelectionModeButton: SwitchSelectionModeButtonDecorator,
        SwitchSelectionModeMenuItem: SwitchSelectionModeMenuItemDecorator,
    };
};
