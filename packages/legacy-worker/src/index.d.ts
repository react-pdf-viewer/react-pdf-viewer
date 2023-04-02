/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

export interface LegacyWorkerProps {
    children?: React.ReactNode;
    workerUrl: string;
}
export class LegacyWorker extends React.Component<LegacyWorkerProps> {}
