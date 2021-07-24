/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

export const Icon: React.FC<{
    size?: number;
}> = ({ children, size = 24 }) => {
    const width = `${size || 24}px`;

    return (
        <svg
            aria-hidden="true"
            className="rpv-core__icon"
            focusable="false"
            height={width}
            viewBox="0 0 24 24"
            width={width}
        >
            {children}
        </svg>
    );
};
