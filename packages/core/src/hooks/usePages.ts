/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import type { PdfJs } from '../types/PdfJs';

export const usePages = (
    doc: PdfJs.PdfDocument
): {
    getPage: (pageIndex: number) => Promise<PdfJs.Page>;
} => {
    const pagesRef = React.useRef<Record<string, PdfJs.Page>>({});

    React.useEffect(() => {
        pagesRef.current = {};
    }, [doc]);

    const getPage = (pageIndex: number): Promise<PdfJs.Page> => {
        if (!doc) {
            return Promise.reject('The document is not loaded yet');
        }

        const pages = pagesRef.current;
        const page = pages[`${pageIndex}`];
        if (page) {
            return Promise.resolve(page);
        }

        return new Promise((resolve, _) => {
            doc.getPage(pageIndex + 1).then((page) => {
                pagesRef.current = Object.assign({}, pagesRef.current, { [`${pageIndex}`]: page });
                resolve(page);
            });
        });
    };

    return {
        getPage,
    };
};
