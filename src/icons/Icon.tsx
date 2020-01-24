/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

interface IconProps {
    size?: number;
}

const Icon: React.FC<IconProps> = ({ children, size = 24 }) => {
    const width = `${size || 24}px`;

    return (
        <svg
            height={width}
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgb(0, 0, 0)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1"
            width={width}
        >
            {children}
        </svg>
    );
};

export default Icon;
