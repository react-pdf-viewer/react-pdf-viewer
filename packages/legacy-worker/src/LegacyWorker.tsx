/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { PdfJsApiProvider } from '@react-pdf-viewer/core';
import { PdfJsApiContext } from '@react-pdf-viewer/core';
import * as PdfJs from 'pdfjs-dist/legacy/build/pdf';
import * as React from 'react';

export const LegacyWorker: React.FC<{
    children?: React.ReactNode;
    workerUrl: string;
}> = ({ children, workerUrl }) => {
    const apiProvider = PdfJs as unknown as PdfJsApiProvider;
    apiProvider.GlobalWorkerOptions.workerSrc = workerUrl;

    return <PdfJsApiContext.Provider value={{ pdfJsApiProvider: apiProvider }}>{children}</PdfJsApiContext.Provider>;
};
