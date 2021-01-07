/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import PdfJs from './vendors/PdfJs';

interface WorkerProps {
    workerUrl: string;
}

const Worker: React.FC<WorkerProps> = ({ children, workerUrl }) => {
    PdfJs.GlobalWorkerOptions.workerSrc = workerUrl;
    return <>{children}</>;
};

export default Worker;
