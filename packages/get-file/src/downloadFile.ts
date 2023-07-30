/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { type PdfJs } from '@react-pdf-viewer/core';

const isChromeIOS = () => /iphone|ipod|ipad/i.test(navigator.userAgent) && /CriOS/i.test(navigator.userAgent);

const isSafariIOS = () => /iphone|ipod|ipad/i.test(navigator.userAgent) && !/CriOS/i.test(navigator.userAgent);

// Encode Uint8Array to base64
const encodeUint8Array = (data: Uint8Array): string =>
    btoa(
        Array(data.length)
            .fill('')
            .map((_, i) => String.fromCharCode(data[i]))
            .join(''),
    );

const download = (url: string, saveAs: string): void => {
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', saveAs);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const downloadBlob = (data: Uint8Array, saveAs: string, mimeType: string): void => {
    const blobUrl = URL.createObjectURL(new Blob([data], { type: mimeType }));
    download(blobUrl, saveAs);
    if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
    }
    return;
};

export const downloadFile = (doc: PdfJs.PdfDocument, saveAs: string): void => {
    doc.getData().then((data) => {
        isSafariIOS()
            ? // `application/pdf` is the correct MIME type for a PDF file. However, it's a known supported file type on iOS
              // and iOS will try to open the file instead of downloading it.
              // Using `application/octet-stream` forces iOS Safari to download the file
              downloadBlob(data, saveAs, 'application/octet-stream')
            : isChromeIOS()
            ? download(`data:application/pdf;base64,${encodeUint8Array(data)}`, saveAs)
            : downloadBlob(data, saveAs, 'application/pdf');
    });
};
