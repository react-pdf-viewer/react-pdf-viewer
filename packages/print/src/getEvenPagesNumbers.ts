/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { type PdfJs } from '@react-pdf-viewer/core';

export const getEvenPagesNumbers = (doc: PdfJs.PdfDocument): number[] =>
    Array(doc.numPages)
        .fill(0)
        .map((_, i) => i)
        .filter((i) => (i + 1) % 2 === 0);
