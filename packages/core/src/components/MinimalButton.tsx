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
                'rpv-core__minimal-button': true,
                'rpv-core__minimal-button--disabled': isDisabled,
                'rpv-core__minimal-button--rtl': isRtl,
                'rpv-core__minimal-button--selected': isSelected,
            })}
            type="button"
            onClick={onClick}
            {...attrs}
        >
            {children}
        </button>
    );
};
