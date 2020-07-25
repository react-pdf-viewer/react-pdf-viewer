/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { ChangeEvent, ReactElement } from 'react';
import { Plugin } from '@phuocng/rpv';

export interface RenderOpenProps {
    onClick: (e: ChangeEvent<HTMLInputElement>) => void;
}

export type RenderOpen = (props: RenderOpenProps) => ReactElement;

export interface OpenProps {
    children?: RenderOpen;
}

export interface OpenPlugin extends Plugin {
    Open: (props: OpenProps) => ReactElement;
    OpenButton: () => ReactElement;
}

export default function openPlugin(): OpenPlugin;
export class OpenFileIcon extends React.Component<{}> {}
