/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { ReactElement } from 'react';
import { createStore, Plugin, PluginFunctions, RenderViewer, Slot } from '@react-pdf-viewer/core';

import SelectionMode from './SelectionMode';
import StoreProps from './StoreProps';
import SwitchSelectionMode, { SwitchSelectionModeProps } from './SwitchSelectionMode';
import SwitchSelectionModeButton from './SwitchSelectionModeButton';
import SwitchSelectionModeMenuItem from './SwitchSelectionModeMenuItem';
import Tracker from './Tracker';

export interface SwitchSelectionModeButtonProps {
    mode: SelectionMode;
}

export interface SwitchSelectionModeMenuItemProps {
    mode: SelectionMode;
    onClick(): void;
}

interface SelectionModePlugin extends Plugin {
    SwitchSelectionMode(props: SwitchSelectionModeProps): ReactElement;
    SwitchSelectionModeButton(props: SwitchSelectionModeButtonProps): ReactElement;
    SwitchSelectionModeMenuItem(props: SwitchSelectionModeMenuItemProps): ReactElement;
}

export interface SelectionModePluginProps {
    selectionMode?: SelectionMode;
}

const selectionModePlugin = (props?: SelectionModePluginProps): SelectionModePlugin => {
    const store = createStore<StoreProps>();

    const SwitchSelectionModeDecorator = (props: SwitchSelectionModeProps) => (
        <SwitchSelectionMode {...props} store={store} />
    );

    const SwitchSelectionModeButtonDecorator = (props: SwitchSelectionModeButtonProps) => (
        <SwitchSelectionModeDecorator mode={props.mode}>
            {
                (p) => (
                    <SwitchSelectionModeButton
                        isSelected={p.isSelected}
                        mode={p.mode}
                        onClick={() => { p.onClick(); }}
                    />
                )
            }
        </SwitchSelectionModeDecorator>
    );

    const SwitchSelectionModeMenuItemDecorator = (props: SwitchSelectionModeMenuItemProps) => (
        <SwitchSelectionModeDecorator mode={props.mode}>
            {
                (p) => (
                    <SwitchSelectionModeMenuItem
                        isSelected={p.isSelected}
                        mode={p.mode}
                        onClick={() => { p.onClick(); props.onClick(); }}
                    />
                )
            }
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

export default selectionModePlugin;
