/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import classNames from '../utils/classNames';

interface MinimalButtonProps {
    ariaLabel?: string;
    ariaKeyShortcuts?: string;
    isDisabled?: boolean;
    isSelected?: boolean;
    onClick(): void;
}

const MinimalButton: React.FC<MinimalButtonProps> = ({
    ariaLabel = '',
    ariaKeyShortcuts = '',
    children,
    isDisabled = false,
    isSelected = false,
    onClick,
}) => (
    <button
        aria-label={ariaLabel}
        {...(ariaKeyShortcuts && { 'aria-keyshortcuts': ariaKeyShortcuts })}
        className={classNames({
            'rpv-core__minimal-button': true,
            'rpv-core__minimal-button--disabled': isDisabled,
            'rpv-core__minimal-button--selected': isSelected,
        })}
        type="button"
        onClick={onClick}
    >
        {children}
    </button>
);

export default MinimalButton;
