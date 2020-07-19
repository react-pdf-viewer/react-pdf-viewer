/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Plugin } from '@phuocng/rpv';

export interface ToolbarSlot {
    currentPage: React.ReactElement;
    currentPageInput: React.ReactElement;
    downloadButton: React.ReactElement;
    fullScreenButton: React.ReactElement;
    goToFirstPage: React.ReactElement;
    goToLastPage: React.ReactElement;
    nextPage: React.ReactElement;
    numberOfPages: React.ReactElement;
    openFileButton: React.ReactElement;
    previousPage: React.ReactElement;
    printButton: React.ReactElement;
}

export type RenderToolbarSlot = (toolbarSlot: ToolbarSlot) => React.ReactElement;
export type RenderToolbar = (renderToolbar: RenderToolbarSlot) => React.ReactElement;

export interface ToolbarProps {
    children?: RenderToolbarSlot;
}

export interface ToolbarPlugin extends Plugin {
    Toolbar: (props: ToolbarProps) => React.ReactElement;
}

export default function toolbarPlugin(): ToolbarPlugin;
