/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import { usePrevious } from '../hooks/usePrevious';
import { SpecialZoomLevel } from '../structs/SpecialZoomLevel';
import type { PdfJs } from '../types/PdfJs';

export interface JumpToDestination {
    bottomOffset: number;
    pageIndex: number;
    scaleTo: number | SpecialZoomLevel;
}

const normalizeDestination = (pageIndex: number, destArray: PdfJs.OutlineDestination): JumpToDestination => {
    let bottomOffset;
    let scale;
    switch (destArray[1].name) {
        case 'XYZ':
            bottomOffset = destArray[3];
            scale = destArray[4];
            return {
                bottomOffset,
                pageIndex: pageIndex - 1,
                scaleTo: scale,
            };
        case 'Fit':
        case 'FitB':
            return {
                bottomOffset: 0,
                pageIndex: pageIndex - 1,
                scaleTo: SpecialZoomLevel.PageFit,
            };
        case 'FitH':
        case 'FitBH':
            return {
                bottomOffset: destArray[2],
                pageIndex: pageIndex - 1,
                scaleTo: SpecialZoomLevel.PageWidth,
            };
        default:
            return {
                bottomOffset: 0,
                pageIndex: pageIndex - 1,
                scaleTo: 1,
            };
    }
};

// Since these values are shared to different plugins, we can't use them as `React.useRef`
const pageOutlinesMap = new Map<string, number>();

// Map the page reference to its index
const pagesMap = new Map<number, PdfJs.Page>();
const previousDoc = {
    docId: '',
};

export const usePages = (
    doc: PdfJs.PdfDocument
): {
    getDestination: (dest: PdfJs.OutlineDestinationType) => Promise<JumpToDestination>;
    getPage: (pageIndex: number) => Promise<PdfJs.Page>;
} => {
    React.useEffect(() => {
        if (previousDoc.docId !== doc.loadingTask.docId) {
            // Clear cache when the document changes
            pageOutlinesMap.clear();
            pagesMap.clear();
        }
        previousDoc.docId = doc.loadingTask.docId;
    }, [doc.loadingTask.docId]);

    const generateRefKey = (outline: PdfJs.OutlineRef): string =>
        `${outline.num}R${outline.gen === 0 ? '' : outline.gen}`;

    const getPageIndex = (outline: PdfJs.OutlineRef): number | null =>
        pageOutlinesMap.get(generateRefKey(outline)) || null;

    const cacheOutlineRef = (outline: PdfJs.OutlineRef, pageIndex: number) => {
        pageOutlinesMap.set(generateRefKey(outline), pageIndex);
    };

    const getPage = (pageIndex: number): Promise<PdfJs.Page> => {
        if (!doc) {
            return Promise.reject('The document is not loaded yet');
        }

        const page = pagesMap.get(pageIndex);
        if (page) {
            return Promise.resolve(page);
        }

        return new Promise((resolve, _) => {
            doc.getPage(pageIndex + 1).then((page) => {
                pagesMap.set(pageIndex, page);
                if (page.ref) {
                    cacheOutlineRef(page.ref, pageIndex + 1);
                }
                resolve(page);
            });
        });
    };

    const getDestination = (dest: PdfJs.OutlineDestinationType): Promise<JumpToDestination> => {
        return new Promise<JumpToDestination>((res) => {
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
                    const pageIndex = getPageIndex(outlineRef);
                    if (pageIndex === null) {
                        doc.getPageIndex(outlineRef).then((pageIndex) => {
                            cacheOutlineRef(outlineRef, pageIndex + 1);
                            getDestination(dest).then((result) => res(result));
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

    return {
        getDestination,
        getPage,
    };
};
