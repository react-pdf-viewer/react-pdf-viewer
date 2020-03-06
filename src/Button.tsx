/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import './button.less';

interface ButtonProps {
    isSelected?: boolean;
    onClick(): void;
}

const Button: React.FC<ButtonProps> = ({ children, isSelected = false, onClick }) => {
    return (
        <button
            className={isSelected ? 'viewer-button viewer-button-selected' : 'viewer-button'}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;
