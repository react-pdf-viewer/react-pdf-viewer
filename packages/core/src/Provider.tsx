/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';
import { type PdfJsApiProvider } from './types/PdfJsApiProvider';
import { PdfJsApiContext } from './vendors/PdfJsApiContext';

export const Provider: React.FC<{
    children?: React.ReactNode;
    pdfApiProvider: PdfJsApiProvider;
    workerUrl: string;
}> = ({ children, pdfApiProvider, workerUrl }) => {
    pdfApiProvider.GlobalWorkerOptions.workerSrc = workerUrl;

    return <PdfJsApiContext.Provider value={{ pdfJsApiProvider: pdfApiProvider }}>{children}</PdfJsApiContext.Provider>;
};
