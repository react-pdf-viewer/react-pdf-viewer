/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { type Destination, type PdfJs } from '@react-pdf-viewer/core';

export interface StoreProps {
    currentPage?: number;
    doc?: PdfJs.PdfDocument;
    jumpToDestination?(destination: Destination): void;
    jumpToNextDestination?(): void;
    jumpToNextPage(): void;
    jumpToPage?(pageIndex: number): void;
    jumpToPreviousDestination?(): void;
    jumpToPreviousPage(): void;
    numberOfPages?: number;
}
