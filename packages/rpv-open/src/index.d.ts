/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';
import { Plugin } from '@phuocng/rpv';

export interface RenderOpenButtonProps {
    onClick: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export type RenderOpenButton = (props: RenderOpenButtonProps) => React.ReactElement;

export interface OpenButtonProps {
    children?: RenderOpenButton;
}

export interface OpenPlugin extends Plugin {
    OpenButton: (props: OpenButtonProps) => React.ReactElement;
}

export default function openPlugin(): OpenPlugin;
export class OpenFileIcon extends React.Component<{}> {}
