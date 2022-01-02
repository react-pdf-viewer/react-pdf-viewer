/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import { PdfJsApi } from './vendors/PdfJsApi';

export const Worker: React.FC<{
    workerUrl: string;
}> = ({ children, workerUrl }) => {
    PdfJsApi.GlobalWorkerOptions.workerSrc = workerUrl;
    return <>{children}</>;
};
