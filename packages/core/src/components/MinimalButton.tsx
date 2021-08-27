/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import { TextDirection, ThemeContext } from '../theme/ThemeContext';
import { classNames } from '../utils/classNames';

export const MinimalButton: React.FC<{
    ariaLabel?: string;
    ariaKeyShortcuts?: string;
    isDisabled?: boolean;
    isSelected?: boolean;
    onClick(): void;
}> = ({ ariaLabel = '', ariaKeyShortcuts = '', children, isDisabled = false, isSelected = false, onClick }) => {
    const { direction } = React.useContext(ThemeContext);
    const isRtl = direction === TextDirection.RightToLeft;

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
        >
            {children}
        </button>
    );
};
