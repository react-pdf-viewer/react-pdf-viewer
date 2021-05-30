/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

interface ProgressBarProps {
    progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => (
    <div className='rpv-core__progress-bar'>
        <div
            className='rpv-core__progress-bar-progress'
            style={{ width: `${progress}%` }}
        >
            {progress}%
        </div>
    </div>
);

export default ProgressBar;
