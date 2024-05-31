/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { RotateDirection, ViewMode, type PdfJs } from '@react-pdf-viewer/core';

export interface StoreProps {
    currentPage?: number;
    doc?: PdfJs.PdfDocument;
    pagesRotation?: Map<number, number>;
    pageHeight?: number;
    pageWidth?: number;
    jumpToPage?(pageIndex: number): void;
    rotatePage(pageIndex: number, direction: RotateDirection): void;
    rotatedPage?: number;
    rotation?: number;
    viewMode: ViewMode;
}
