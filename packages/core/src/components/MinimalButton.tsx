/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';
import styles from '../styles/minimalButton.module.css';
import { TextDirection, ThemeContext } from '../theme/ThemeContext';
import { classNames } from '../utils/classNames';

export const MinimalButton: React.FC<{
    ariaLabel?: string;
    ariaKeyShortcuts?: string;
    children?: React.ReactNode;
    isDisabled?: boolean;
    isSelected?: boolean;
    testId?: string;
    onClick(): void;
}> = ({ ariaLabel = '', ariaKeyShortcuts = '', children, isDisabled = false, isSelected = false, testId, onClick }) => {
    const { direction } = React.useContext(ThemeContext);
    const isRtl = direction === TextDirection.RightToLeft;
    const attrs = testId ? { 'data-testid': testId } : {};

    return (
        <button
            aria-label={ariaLabel}
            {...(ariaKeyShortcuts && { 'aria-keyshortcuts': ariaKeyShortcuts })}
            {...(isDisabled && { 'aria-disabled': true })}
            className={classNames({
                [styles.button]: true,
                [styles.buttonDisabled]: isDisabled,
                [styles.buttonRtl]: isRtl,
                [styles.buttonSelected]: isSelected,
            })}
            type="button"
            onClick={onClick}
            {...attrs}
        >
            {children}
        </button>
    );
};
