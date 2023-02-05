/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { Plugin, PluginFunctions, RenderViewer, Slot, ViewerState } from '@react-pdf-viewer/core';
import { createStore, SpecialZoomLevel } from '@react-pdf-viewer/core';
import * as React from 'react';
import { CurrentScale, CurrentScaleProps } from './CurrentScale';
import { PinchZoom } from './PinchZoom';
import { ShortcutHandler } from './ShortcutHandler';
import type { StoreProps } from './types/StoreProps';
import type { ZoomMenuItemProps } from './types/ZoomMenuItemProps';
import { Zoom, ZoomProps } from './Zoom';
import { ZoomIn, ZoomInProps } from './ZoomIn';
import { ZoomInButton } from './ZoomInButton';
import { ZoomInMenuItem } from './ZoomInMenuItem';
import { ZoomOut, ZoomOutProps } from './ZoomOut';
import { ZoomOutButton } from './ZoomOutButton';
import { ZoomOutMenuItem } from './ZoomOutMenuItem';
import { ZoomPopover } from './ZoomPopover';

export interface ZoomPopoverProps {
    levels?: number[];
}

export interface ZoomPlugin extends Plugin {
    zoomTo: (scale: number | SpecialZoomLevel) => void;
    CurrentScale: (props: CurrentScaleProps) => React.ReactElement;
    ZoomIn: (props: ZoomInProps) => React.ReactElement;
    ZoomInButton: () => React.ReactElement;
    ZoomInMenuItem: (props: ZoomMenuItemProps) => React.ReactElement;
    ZoomOut: (props: ZoomOutProps) => React.ReactElement;
    ZoomOutButton: () => React.ReactElement;
    ZoomOutMenuItem: (props: ZoomMenuItemProps) => React.ReactElement;
    Zoom: (props: ZoomProps) => React.ReactElement;
    ZoomPopover: (props?: ZoomPopoverProps) => React.ReactElement;
}

export interface ZoomPluginProps {
    enableShortcuts?: boolean;
}

export const zoomPlugin = (props?: ZoomPluginProps): ZoomPlugin => {
    const zoomPluginProps = React.useMemo(() => Object.assign({}, { enableShortcuts: true }, props), []);
    const store = React.useMemo(() => createStore<StoreProps>({}), []);

    const CurrentScaleDecorator = (props: CurrentScaleProps) => <CurrentScale {...props} store={store} />;

    const ZoomInDecorator = (props: ZoomInProps) => (
        <ZoomIn enableShortcuts={zoomPluginProps.enableShortcuts} {...props} store={store} />
    );

    const ZoomInButtonDecorator = () => <ZoomInDecorator>{(props) => <ZoomInButton {...props} />}</ZoomInDecorator>;

    const ZoomInMenuItemDecorator = (props: ZoomMenuItemProps) => (
        <ZoomInDecorator>
            {(p) => (
                <ZoomInMenuItem
                    onClick={() => {
                        p.onClick();
                        props.onClick();
                    }}
                />
            )}
        </ZoomInDecorator>
    );

    const ZoomOutDecorator = (props: ZoomOutProps) => (
        <ZoomOut enableShortcuts={zoomPluginProps.enableShortcuts} {...props} store={store} />
    );

    const ZoomOutButtonDecorator = () => <ZoomOutDecorator>{(props) => <ZoomOutButton {...props} />}</ZoomOutDecorator>;

    const ZoomOutMenuItemDecorator = (props: ZoomMenuItemProps) => (
        <ZoomOutDecorator>
            {(p) => (
                <ZoomOutMenuItem
                    onClick={() => {
                        p.onClick();
                        props.onClick();
                    }}
                />
            )}
        </ZoomOutDecorator>
    );

    const ZoomDecorator = (props: ZoomProps) => <Zoom {...props} store={store} />;

    const ZoomPopoverDecorator = (zoomPopverProps?: ZoomPopoverProps) => (
        <ZoomDecorator>{(props) => <ZoomPopover levels={zoomPopverProps?.levels} {...props} />}</ZoomDecorator>
    );

    const renderViewer = (props: RenderViewer): Slot => {
        const { slot } = props;
        if (!zoomPluginProps.enableShortcuts) {
            return slot;
        }

        const updateSlot: Slot = {
            children: (
                <>
                    <ShortcutHandler containerRef={props.containerRef} store={store} />
                    <PinchZoom pagesContainerRef={props.pagesContainerRef} store={store} />
                    {slot.children}
                </>
            ),
        };
        return { ...slot, ...updateSlot };
    };

    return {
        renderViewer,
        install: (pluginFunctions: PluginFunctions) => {
            store.update('zoom', pluginFunctions.zoom);
        },
        onViewerStateChange: (viewerState: ViewerState) => {
            store.update('scale', viewerState.scale);
            return viewerState;
        },
        zoomTo: (scale: number | SpecialZoomLevel) => {
            const zoom = store.get('zoom');
            if (zoom) {
                zoom(scale);
            }
        },
        CurrentScale: CurrentScaleDecorator,
        ZoomIn: ZoomInDecorator,
        ZoomInButton: ZoomInButtonDecorator,
        ZoomInMenuItem: ZoomInMenuItemDecorator,
        ZoomOut: ZoomOutDecorator,
        ZoomOutButton: ZoomOutButtonDecorator,
        ZoomOutMenuItem: ZoomOutMenuItemDecorator,
        Zoom: ZoomDecorator,
        ZoomPopover: ZoomPopoverDecorator,
    };
};
