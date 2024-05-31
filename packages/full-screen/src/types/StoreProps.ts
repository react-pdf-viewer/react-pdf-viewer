/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { FullScreenMode, SpecialZoomLevel } from '@react-pdf-viewer/core';

export interface StoreProps {
    enterFullScreenMode(target: HTMLElement): void;
    exitFullScreenMode(): void;
    fullScreenMode: FullScreenMode;
    getPagesContainer?(): HTMLElement;
    zoom(scale: number | SpecialZoomLevel): void;
}
