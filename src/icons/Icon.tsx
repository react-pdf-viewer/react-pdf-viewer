/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useContext } from 'react';

import ThemeContext from '../theme/ThemeContext';
import './icon.less';

interface IconProps {
    size?: number;
}

const Icon: React.FC<IconProps> = ({ children, size = 24 }) => {
    const theme = useContext(ThemeContext);
    const width = `${size || 24}px`;

    return (
        <svg
            className={`${theme.prefixClass}-icon`}
            height={width}
            viewBox="0 0 24 24"
            width={width}
        >
            {children}
        </svg>
    );
};

export default Icon;
