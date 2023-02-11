/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { SpecialZoomLevel } from '../structs/SpecialZoomLevel';
import type { Destination } from '../types/Destination';
import type { PdfJs } from '../types/PdfJs';

const normalizeDestination = (pageIndex: number, destArray: PdfJs.OutlineDestination): Destination => {
    switch (destArray[1].name) {
        case 'XYZ':
            // The `bottom` and `left` offsets are defined by `destArray[3]` and `destArray[2]`, respectively.
            // If they aren't provided, then they can be determined from the height of width of viewport
            return {
                bottomOffset: (_: number, viewportHeight: number) =>
                    destArray[3] === null ? viewportHeight : destArray[3],
                leftOffset: (_: number, __: number) => (destArray[2] === null ? 0 : destArray[2]),
                pageIndex,
                scaleTo: destArray[4],
            };
        case 'Fit':
        case 'FitB':
            return {
                bottomOffset: 0,
                leftOffset: 0,
                pageIndex,
                scaleTo: SpecialZoomLevel.PageFit,
            };
        case 'FitH':
        case 'FitBH':
            return {
                bottomOffset: destArray[2],
                leftOffset: 0,
                pageIndex,
                scaleTo: SpecialZoomLevel.PageWidth,
            };
        default:
            return {
                bottomOffset: 0,
                leftOffset: 0,
                pageIndex,
                scaleTo: 1,
            };
    }
};

// Since these values are shared to different plugins, we can't use them as `React.useRef`
// Map the page reference to its index (zero-based index)
const pageOutlinesMap = new Map<string, number>();

// Map the index to the page instance
const pagesMap = new Map<string, PdfJs.Page>();

const generateRefKey = (doc: PdfJs.PdfDocument, outline: PdfJs.OutlineRef): string =>
    `${doc.loadingTask.docId}___${outline.num}R${outline.gen === 0 ? '' : outline.gen}`;

const getPageIndex = (doc: PdfJs.PdfDocument, outline: PdfJs.OutlineRef): number | null => {
    const key = generateRefKey(doc, outline);
    return pageOutlinesMap.has(key) ? pageOutlinesMap.get(key) : null;
};

const cacheOutlineRef = (doc: PdfJs.PdfDocument, outline: PdfJs.OutlineRef, pageIndex: number) => {
    pageOutlinesMap.set(generateRefKey(doc, outline), pageIndex);
};

export const clearPagesCache = () => {
    pageOutlinesMap.clear();
    pagesMap.clear();
};

export const getPage = (doc: PdfJs.PdfDocument, pageIndex: number): Promise<PdfJs.Page> => {
    if (!doc) {
        return Promise.reject('The document is not loaded yet');
    }

    const pageKey = `${doc.loadingTask.docId}___${pageIndex}`;
    const page = pagesMap.get(pageKey);
    if (page) {
        return Promise.resolve(page);
    }

    return new Promise((resolve, _) => {
        doc.getPage(pageIndex + 1).then((page) => {
            pagesMap.set(pageKey, page);
            if (page.ref) {
                cacheOutlineRef(doc, page.ref, pageIndex);
            }
            resolve(page);
        });
    });
};

export const getDestination = (doc: PdfJs.PdfDocument, dest: PdfJs.OutlineDestinationType): Promise<Destination> => {
    return new Promise<Destination>((res) => {
        new Promise<PdfJs.OutlineDestination>((resolve) => {
            if (typeof dest === 'string') {
                doc.getDestination(dest).then((destArray) => {
                    resolve(destArray);
                });
            } else {
                resolve(dest);
            }
        }).then((destArray) => {
            if ('object' === typeof destArray[0] && destArray[0] !== null) {
                const outlineRef = destArray[0] as PdfJs.OutlineRef;
                const pageIndex = getPageIndex(doc, outlineRef);
                if (pageIndex === null) {
                    doc.getPageIndex(outlineRef).then((pageIndex) => {
                        cacheOutlineRef(doc, outlineRef, pageIndex);
                        getDestination(doc, dest).then((result) => res(result));
                    });
                } else {
                    res(normalizeDestination(pageIndex, destArray));
                }
            } else {
                const target = normalizeDestination(destArray[0] as number, destArray);
                res(target);
            }
        });
    });
};
