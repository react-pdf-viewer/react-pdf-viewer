/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { ChangeEvent, Component, ReactElement } from 'react';
import { Plugin } from '@react-pdf-viewer/core';

export interface RenderOpenProps {
    onClick: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface OpenProps {
    children?: (props: RenderOpenProps) => ReactElement;
}

export interface OpenPlugin extends Plugin {
    Open: (props: OpenProps) => ReactElement;
    OpenButton: () => ReactElement;
}

export default function openPlugin(): OpenPlugin;
export class OpenFileIcon extends Component {}
