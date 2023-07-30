/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { type PdfJsApiProvider } from '../types/PdfJsApiProvider';

export interface PdfJsApiContextProps {
    pdfJsApiProvider?: PdfJsApiProvider;
}

export const PdfJsApiContext = React.createContext<PdfJsApiContextProps>({});
