/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import ThemeContent from './theme/ThemeContext';
import './button.less';

interface ButtonProps {
    isSelected?: boolean;
    onClick(): void;
}

const Button: React.FC<ButtonProps> = ({ children, isSelected = false, onClick }) => {
    const theme = React.useContext(ThemeContent);

    return (
        <button
            className={isSelected ? `${theme.prefixClass}-button ${theme.prefixClass}-button-selected` : `${theme.prefixClass}-button`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;
