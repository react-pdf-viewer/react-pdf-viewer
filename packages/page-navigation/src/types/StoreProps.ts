/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { DestinationOffsetFromViewport, PdfJs } from '@react-pdf-viewer/core';
import { SpecialZoomLevel } from '@react-pdf-viewer/core';

export interface JumpFromAnnotation {
    bottomOffset: number;
    dest: string;
    leftOffset: number;
    pageIndex: number;
}

export interface StoreProps {
    currentPage?: number;
    doc?: PdfJs.PdfDocument;
    jumpFromAnnotation?: JumpFromAnnotation;
    jumpToDestination?(
        pageIndex: number,
        bottomOffset: number | DestinationOffsetFromViewport,
        leftOffset: number | DestinationOffsetFromViewport,
        scaleTo?: number | SpecialZoomLevel
    ): void;
    jumpToPage?(pageIndex: number): void;
    numberOfPages?: number;
}
