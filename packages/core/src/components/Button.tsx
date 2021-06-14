/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

interface ButtonProps {
    onClick(): void;
}

const Button: React.FC<ButtonProps> = ({ children, onClick }) => (
    <button className='rpv-core__button' onClick={onClick}>
        {children}
    </button>
);

export default Button;
