/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';
import { useSafeState } from '../hooks/useSafeState';
import { type PdfJs } from '../types/PdfJs';

const flaternSingleOutline = (outline: PdfJs.Outline): PdfJs.Outline[] => {
    let result = [] as PdfJs.Outline[];
    if (outline.items && outline.items.length > 0) {
        result = result.concat(flaternOutlines(outline.items));
    }
    return result;
};

const flaternOutlines = (outlines: PdfJs.Outline[]): PdfJs.Outline[] => {
    let result = [] as PdfJs.Outline[];
    outlines.map((outline) => {
        result = result.concat(outline).concat(flaternSingleOutline(outline));
    });
    return result;
};

export const useOutlines = (doc: PdfJs.PdfDocument) => {
    const [outlines, setOutlines] = useSafeState<PdfJs.Outline[]>([]);

    React.useEffect(() => {
        doc.getOutline().then((result) => {
            if (result !== null) {
                const items = flaternOutlines(result);
                setOutlines(items);
            }
        });
    }, []);

    return outlines;
};
