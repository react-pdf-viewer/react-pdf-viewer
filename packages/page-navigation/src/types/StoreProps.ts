/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
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
