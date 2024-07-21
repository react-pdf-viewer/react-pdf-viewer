/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';
import styles from '../styles/progressBar.module.css';
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
                [styles.bar]: true,
                [styles.barRtl]: isRtl,
            })}
        >
            <div className={styles.progress} style={{ width: `${progress}%` }}>
                {progress}%
            </div>
        </div>
    );
};
