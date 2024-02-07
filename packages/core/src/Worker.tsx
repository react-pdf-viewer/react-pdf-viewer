/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as PdfJs from 'pdfjs-dist';
import * as React from 'react';
import { type PdfJsApiProvider } from './types/PdfJsApiProvider';
import { PdfJsApiContext } from './vendors/PdfJsApiContext';

export const Worker: React.FC<{
    children?: React.ReactNode;
    workerUrl: string;
}> = ({ children, workerUrl }) => {
    const apiProvider = PdfJs as unknown as PdfJsApiProvider;
    apiProvider.GlobalWorkerOptions.workerSrc = workerUrl;

    return <PdfJsApiContext.Provider value={{ pdfJsApiProvider: apiProvider }}>{children}</PdfJsApiContext.Provider>;
};
