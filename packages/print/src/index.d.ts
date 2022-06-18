/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { PdfJs, Plugin } from '@react-pdf-viewer/core';
import * as React from 'react';

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
    print: () => void;
    Print: (props: PrintProps) => React.ReactElement;
    PrintButton: () => React.ReactElement;
    PrintMenuItem: (props: PrintMenuItemProps) => React.ReactElement;
}

export interface PrintPluginProps {
    enableShortcuts?: boolean;
    renderProgressBar?(numLoadedPages: number, numPages: number): React.ReactElement;
    setPages?: (doc: PdfJs.PdfDocument) => number[];
}

export function printPlugin(props?: PrintPluginProps): PrintPlugin;

// Components
export class PrintIcon extends React.Component {}
