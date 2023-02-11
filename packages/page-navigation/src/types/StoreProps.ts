/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { Destination, PdfJs } from '@react-pdf-viewer/core';

export interface JumpFromAnnotation {
    bottomOffset: number;
    dest: PdfJs.OutlineDestinationType;
    leftOffset: number;
    pageIndex: number;
}

export interface StoreProps {
    currentPage?: number;
    doc?: PdfJs.PdfDocument;
    jumpFromAnnotation?: JumpFromAnnotation;
    jumpToDestination?(destination: Destination): void;
    jumpToNextPage(): void;
    jumpToPreviousPage(): void;
    jumpToPage?(pageIndex: number): void;
    numberOfPages?: number;
}
