/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Plugin, SpecialZoomLevel } from '@react-pdf-viewer/core';

export interface RenderEnterFullScreenProps {
    onClick(): void;
}

export interface EnterFullScreenProps {
    children?(props: RenderEnterFullScreenProps): React.ReactElement;
}

export interface EnterFullScreenMenuItemProps {
    onClick(): void;
}

export interface FullScreenPlugin extends Plugin {
    EnterFullScreen(props: EnterFullScreenProps): React.ReactElement;
    EnterFullScreenButton(): React.ReactElement;
    EnterFullScreenMenuItem: (
        props: EnterFullScreenMenuItemProps
    ) => React.ReactElement;
}

export type Zoom = (scale: number | SpecialZoomLevel) => void;

export interface FullScreenPluginProps {
    onEnterFullScreen?(zoom: Zoom): void;
    onExitFullScreen?(zoom: Zoom): void;
}

export function fullScreenPlugin(
    props?: FullScreenPluginProps
): FullScreenPlugin;

export class ExitFullScreenIcon extends React.Component {}
export class FullScreenIcon extends React.Component {}
