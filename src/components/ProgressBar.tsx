/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import ThemeContext from '../theme/ThemeContext';
import './progressBar.less';

interface ProgressBarProps {
    progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
    const theme = React.useContext(ThemeContext);

    return (
        <div className={`${theme.prefixClass}-progress-bar`}>
            <div
                className={`${theme.prefixClass}-progress-bar-inner`}
                style={{ width: `${progress}%` }}
            >
                {progress}%
            </div>
        </div>
    );
};

export default ProgressBar;
