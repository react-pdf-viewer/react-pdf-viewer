/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import type { Plugin } from '@react-pdf-viewer/core';

export interface RenderOpenProps {
    onClick: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface OpenProps {
    children?: (props: RenderOpenProps) => React.ReactElement;
}

export interface OpenPlugin extends Plugin {
    Open: (props: OpenProps) => React.ReactElement;
    OpenButton: () => React.ReactElement;
    OpenMenuItem: () => React.ReactElement;
}

export function openPlugin(): OpenPlugin;
export class OpenFileIcon extends React.Component {}
