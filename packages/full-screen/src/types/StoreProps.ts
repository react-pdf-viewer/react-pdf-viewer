/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { ScrollMode, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { FullScreenMode } from '../structs/FullScreenMode';

export interface StoreProps {
    currentPage: number;
    fullScreenMode: FullScreenMode;
    getPagesContainer?(): HTMLElement;
    isFullScreen?: boolean;
    jumpToPage(pageIndex: number): void;
    scrollMode?: ScrollMode;
    zoom?(scale: number | SpecialZoomLevel): void;
}
