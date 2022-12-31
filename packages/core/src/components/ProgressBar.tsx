/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { TextDirection, ThemeContext } from '../theme/ThemeContext';
import { classNames } from '../utils/classNames';

export const ProgressBar: React.FC<{
    progress: number;
}> = ({ progress }) => {
    const { direction } = React.useContext(ThemeContext);
    const isRtl = direction === TextDirection.RightToLeft;

    return (
        <div
            className={classNames({
                'rpv-core__progress-bar': true,
                'rpv-core__progress-bar--rtl': isRtl,
            })}
        >
            <div className="rpv-core__progress-bar-progress" style={{ width: `${progress}%` }}>
                {progress}%
            </div>
        </div>
    );
};
