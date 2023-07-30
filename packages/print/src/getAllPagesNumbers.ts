/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { type PdfJs } from '@react-pdf-viewer/core';

export const getAllPagesNumbers = (doc: PdfJs.PdfDocument): number[] =>
    Array(doc.numPages)
        .fill(0)
        .map((_, i) => i);
