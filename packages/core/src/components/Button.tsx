/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import ThemeContext from '../theme/ThemeContext';
import classNames from '../utils/classNames';

interface ButtonProps {
    isSelected?: boolean;
    onClick(): void;
}

const Button: React.FC<ButtonProps> = ({ children, isSelected = false, onClick }) => {
    const theme = React.useContext(ThemeContext);

    return (
        <button
            className={
                classNames({
                    [`${theme.prefixClass}-button`]: true,
                    [`${theme.prefixClass}-button-selected`]: isSelected,
                })
            }
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;
