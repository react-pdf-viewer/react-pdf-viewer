/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { type PdfJs } from '../types/PdfJs';

// Return `true` if `a` is the same as `b`
export const isSameUrl = (a: PdfJs.FileData, b: PdfJs.FileData): boolean => {
    const typeA = typeof a;
    const typeB = typeof b;

    if (typeA === 'string' && typeB === 'string' && a === b) {
        return true;
    }
    if (typeA === 'object' && typeB === 'object') {
        return a.length === b.length && (a as Uint8Array).every((v, i) => v === b[i]);
    }
    return false;
};
