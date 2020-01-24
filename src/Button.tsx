/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import './button.css';

interface ButtonProps {
    isSelected?: boolean;
    onClick(): void;
}

const Button: React.FC<ButtonProps> = ({ children, isSelected = false, onClick }) => {
    return (
        <button
            className="viewer-button"
            style={{
                backgroundColor: isSelected ? 'rgba(0, 0, 0, .1)' : '',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                padding: '8px',
            }}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;
