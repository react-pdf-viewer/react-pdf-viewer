/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { type PdfJs } from '@react-pdf-viewer/core';
import { PageMode } from '@react-pdf-viewer/core';

export const setInitialTabFromPageMode = (doc: PdfJs.PdfDocument) =>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    new Promise<number>((resolve, _) => {
        doc.getPageMode().then((pageMode) => {
            if (!pageMode) {
                resolve(-1);
            } else {
                switch (pageMode) {
                    case PageMode.Attachments:
                        resolve(2);
                        break;
                    case PageMode.Bookmarks:
                        resolve(1);
                        break;
                    case PageMode.Thumbnails:
                        resolve(0);
                        break;
                    default:
                        resolve(-1);
                        break;
                }
            }
        });
    });
