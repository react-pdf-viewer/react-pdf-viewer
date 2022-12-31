/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { RotateDirection } from '../structs/RotateDirection';
import { ScrollMode } from '../structs/ScrollMode';
import { SpecialZoomLevel } from '../structs/SpecialZoomLevel';
import { ViewMode } from '../structs/ViewMode';
import type { ThemeContextProps } from '../theme/ThemeContext';
import type { PdfJs } from '../types/PdfJs';
import type { PageSize } from './PageSize';
import type { Slot } from './Slot';

export interface RenderViewer {
    containerRef: React.RefObject<HTMLDivElement>;
    doc: PdfJs.PdfDocument;
    pagesContainerRef: React.RefObject<HTMLDivElement>;
    // The rotation for each page
    pagesRotation: Map<number, number>;
    pageSizes: PageSize[];
    rotation: number;
    slot: Slot;
    themeContext: ThemeContextProps;
    openFile(file: File): void;
    jumpToPage(page: number): void;
    rotate(direction: RotateDirection): void;
    rotatePage(pageIndex: number, direction: RotateDirection): void;
    switchScrollMode(scrollMode: ScrollMode): void;
    switchViewMode(viewMode: ViewMode): void;
    zoom(level: number | SpecialZoomLevel): void;
}
