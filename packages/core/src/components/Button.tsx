/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import classNames from '../utils/classNames';

interface ButtonProps {
    isDisabled?: boolean;
    isSelected?: boolean;
    onClick(): void;
}

const Button: React.FC<ButtonProps> = ({ children, isDisabled = false, isSelected = false, onClick }) => (
    <button
        className={
            classNames({
                'rpv-core__button': true,
                'rpv-core__button--disabled': isDisabled,
                'rpv-core__button--selected': isSelected,
            })
        }
        onClick={onClick}
    >
        {children}
    </button>
);

export default Button;
