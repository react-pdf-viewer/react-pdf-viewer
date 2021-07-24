/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import { PdfJs } from './vendors/PdfJs';

export const Worker: React.FC<{
    workerUrl: string;
}> = ({ children, workerUrl }) => {
    PdfJs.GlobalWorkerOptions.workerSrc = workerUrl;
    return <>{children}</>;
};
