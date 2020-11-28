/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import SpecialZoomLevel from '../SpecialZoomLevel';
import ViewerState from './ViewerState';

export default interface PluginFunctions {
    getPageElement(pageIndex: number): HTMLElement | null;
    getPagesRef(): React.RefObject<HTMLDivElement>;
    getViewerState(): ViewerState;
    jumpToDestination(
        pageIndex: number,
        bottomOffset: number,
        leftOffset: number,
        scaleTo: number | SpecialZoomLevel
    ): void;
    jumpToPage(pageIndex: number): void;
    openFile(file: File): void;
    rotate(rotation: number): void;
    setViewerState(viewerState: ViewerState): void;
    zoom(scale: number | SpecialZoomLevel): void;
}
