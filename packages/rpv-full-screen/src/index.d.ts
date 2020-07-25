/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';
import { Plugin } from '@phuocng/rpv';

export interface RenderEnterFullScreenProps {
    onClick: () => void;
}

type RenderEnterFullScreen = (props: RenderEnterFullScreenProps) => React.ReactElement;

export interface EnterFullScreenProps {
    children?: RenderEnterFullScreen;
}

export interface FullScreenPlugin extends Plugin {
    EnterFullScreen: (props: EnterFullScreenProps) => React.ReactElement;
    EnterFullScreenButton: () => React.ReactElement;
}

export default function fullScreenPlugin(): FullScreenPlugin;

export class ExitFullScreenIcon extends React.Component<{}> {}
export class FullScreenIcon extends React.Component<{}> {}
