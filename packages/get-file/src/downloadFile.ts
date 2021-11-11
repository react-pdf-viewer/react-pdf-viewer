/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { OpenFile, PdfJs } from '@react-pdf-viewer/core';

export const downloadFile = (doc: PdfJs.PdfDocument, saveAs: string): void => {
    doc.getData().then((data) => {
        // `application/pdf` is the correct MIME type for a PDF file. However, it's a known supported file type on iOS
        // and iOS will try to open the file instead of downloading it.
        // Using `application/octet-stream` forces iOS Safari to download the file
        const blobUrl = URL.createObjectURL(new Blob([data], { type: 'application/octet-stream' }));
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = blobUrl;
        link.setAttribute('download', saveAs);

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        if (blobUrl) {
            URL.revokeObjectURL(blobUrl);
        }
    });
};
