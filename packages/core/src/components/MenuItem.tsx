/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';
import { CheckIcon } from '../icons/CheckIcon';
import styles from '../styles/menuItem.module.css';
import { TextDirection, ThemeContext } from '../theme/ThemeContext';
import { classNames } from '../utils/classNames';

export const MenuItem: React.FC<{
    checked?: boolean;
    children?: React.ReactNode;
    icon?: React.ReactElement;
    isDisabled?: boolean;
    testId?: string;
    onClick(): void;
}> = ({ checked = false, children, icon = null, isDisabled = false, testId, onClick }) => {
    const { direction } = React.useContext(ThemeContext);
    const isRtl = direction === TextDirection.RightToLeft;
    const attrs = testId ? { 'data-testid': testId } : {};

    return (
        <button
            className={classNames({
                [styles.item]: true,
                [styles.itemDisabled]: isDisabled,
                [styles.itemLtr]: !isRtl,
                [styles.itemRtl]: isRtl,
            })}
            role="menuitem"
            tabIndex={-1}
            type="button"
            onClick={onClick}
            {...attrs}
        >
            <div
                className={classNames({
                    [styles.icon]: true,
                    [styles.iconLtr]: !isRtl,
                    [styles.iconRtl]: isRtl,
                })}
            >
                {icon}
            </div>
            <div
                className={classNames({
                    [styles.label]: true,
                    [styles.labelLtr]: !isRtl,
                    [styles.labelRtl]: isRtl,
                })}
            >
                {children}
            </div>
            <div
                className={classNames({
                    [styles.checkLtr]: !isRtl,
                    [styles.checkRtl]: isRtl,
                })}
            >
                {checked && <CheckIcon />}
            </div>
        </button>
    );
};
