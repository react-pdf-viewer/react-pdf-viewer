/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import type { Plugin } from '@react-pdf-viewer/core';

// Types
export interface RenderPrintProps {
    enableShortcuts: boolean;
    onClick: () => void;
}

export interface PrintMenuItemProps {
    onClick(): void;
}

export interface PrintProps {
    children?: (props: RenderPrintProps) => React.ReactElement;
}

// Plugin
export interface PrintPlugin extends Plugin {
    Print: (props: PrintProps) => React.ReactElement;
    PrintButton: () => React.ReactElement;
    PrintMenuItem: (props: PrintMenuItemProps) => React.ReactElement;
}

export interface PrintPluginProps {
    enableShortcuts?: boolean;
}

export function printPlugin(props?: PrintPluginProps): PrintPlugin;

// Components
export class PrintIcon extends React.Component {}
