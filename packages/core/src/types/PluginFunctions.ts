/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { SpecialZoomLevel } from '../structs/SpecialZoomLevel';
import type { ViewerState } from './ViewerState';

export type DestinationOffsetFromViewport = (viewportWidth: number, viewportHeight: number) => number;

export interface PluginFunctions {
    getPageElement(pageIndex: number): HTMLElement | null;
    getPagesContainer(): HTMLElement;
    getViewerState(): ViewerState;
    jumpToDestination(
        pageIndex: number,
        bottomOffset: number | DestinationOffsetFromViewport,
        leftOffset: number | DestinationOffsetFromViewport,
        scaleTo: number | SpecialZoomLevel
    ): void;
    jumpToPage(pageIndex: number): void;
    openFile(file: File): void;
    rotate(rotation: number): void;
    setViewerState(viewerState: ViewerState): void;
    zoom(scale: number | SpecialZoomLevel): void;
}
