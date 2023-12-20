/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';

export const Worker: React.FC<{
    children?: React.ReactNode;
    workerUrl: string;
}> = ({ children }) => {
    throw new Error('The Worker component is moved to @react-pdf-viewer/worker or @react-pdf-viewer/legacy-worker');
};
