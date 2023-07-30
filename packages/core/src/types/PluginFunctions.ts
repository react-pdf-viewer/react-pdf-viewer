/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { RotateDirection } from '../structs/RotateDirection';
import { ScrollMode } from '../structs/ScrollMode';
import { SpecialZoomLevel } from '../structs/SpecialZoomLevel';
import { ViewMode } from '../structs/ViewMode';
import { type Destination } from './Destination';
import { type ViewerState } from './ViewerState';

export interface PluginFunctions {
    enterFullScreenMode(target: HTMLElement): void;
    exitFullScreenMode(): void;
    getPagesContainer(): HTMLElement;
    getViewerState(): ViewerState;
    jumpToDestination(destination: Destination): Promise<void>;
    jumpToNextDestination(): Promise<void>;
    jumpToPreviousDestination(): Promise<void>;
    jumpToNextPage(): Promise<void>;
    jumpToPreviousPage(): Promise<void>;
    jumpToPage(pageIndex: number): Promise<void>;
    openFile(file: File): void;
    rotate(direction: RotateDirection): void;
    rotatePage(pageIndex: number, direction: RotateDirection): void;
    setViewerState(viewerState: ViewerState): void;
    switchScrollMode(scrollMode: ScrollMode): void;
    switchViewMode(viewMode: ViewMode): void;
    zoom(scale: number | SpecialZoomLevel): void;
}
