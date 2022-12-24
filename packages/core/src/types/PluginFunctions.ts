/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { RotateDirection } from '../structs/RotateDirection';
import { ScrollMode } from '../structs/ScrollMode';
import { SpecialZoomLevel } from '../structs/SpecialZoomLevel';
import { ViewMode } from '../structs/ViewMode';
import type { ViewerState } from './ViewerState';

export type DestinationOffsetFromViewport = (viewportWidth: number, viewportHeight: number) => number;

export interface PluginFunctions {
    getPagesContainer(): HTMLElement;
    getViewerState(): ViewerState;
    jumpToDestination(
        pageIndex: number,
        bottomOffset: number | DestinationOffsetFromViewport,
        leftOffset: number | DestinationOffsetFromViewport,
        scaleTo: number | SpecialZoomLevel
    ): void;
    jumpToNextPage(): void;
    jumpToPreviousPage(): void;
    jumpToPage(pageIndex: number): void;
    openFile(file: File): void;
    rotate(direction: RotateDirection): void;
    rotatePage(pageIndex: number, direction: RotateDirection): void;
    setViewerState(viewerState: ViewerState): void;
    switchScrollMode(scrollMode: ScrollMode): void;
    switchViewMode(viewMode: ViewMode): void;
    zoom(scale: number | SpecialZoomLevel): void;
}
