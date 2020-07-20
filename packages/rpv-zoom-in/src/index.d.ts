/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';
import { Plugin } from '@phuocng/rpv';

export interface RenderZoomInButtonProps {
    onClick: () => void;
}

export type RenderZoomInButton = (props: RenderZoomInButtonProps) => React.ReactElement;

export interface ZoomInButtonProps {
    children?: RenderZoomInButton;
}

export interface ZoomInPlugin extends Plugin {
    ZoomInButton: (props: ZoomInButtonProps) => React.ReactElement;
}

export default function zoomInPlugin(): ZoomInPlugin;
export class ZoomInIcon extends React.Component<{}> {}
