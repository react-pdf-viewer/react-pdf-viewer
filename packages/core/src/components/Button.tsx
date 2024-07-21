/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';
import styles from '../styles/button.module.css';
import { TextDirection, ThemeContext } from '../theme/ThemeContext';
import { classNames } from '../utils/classNames';

export const Button: React.FC<{
    children?: React.ReactNode;
    testId?: string;
    onClick(): void;
}> = ({ children, testId, onClick }) => {
    const { direction } = React.useContext(ThemeContext);
    const isRtl = direction === TextDirection.RightToLeft;

    const attrs = testId ? { 'data-testid': testId } : {};
    return (
        <button
            className={classNames({
                [styles.button]: true,
                [styles.buttonRtl]: isRtl,
            })}
            type="button"
            onClick={onClick}
            {...attrs}
        >
            {children}
        </button>
    );
};
