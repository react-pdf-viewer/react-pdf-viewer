/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import SpecialZoomLevel from '../SpecialZoomLevel';
import { ViewerState } from './ViewerState';

export interface PluginFunctionsProps {
    getPagesRef(): React.RefObject<HTMLDivElement>;
    getViewerState(): ViewerState;
    jumpToPage(pageIndex: number): void;
    openFile(file: File): void;
    setViewerState(viewerState: ViewerState): void;
    zoom(scale: number | SpecialZoomLevel): void;
}

export type PluginFunctions = PluginFunctionsProps;
