/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { TextDirection, ThemeContext } from '../theme/ThemeContext';
import { classNames } from '../utils/classNames';

export const Icon: React.FC<{
    children?: React.ReactNode;
    // If this option is `true`, the icon will not be flipped
    ignoreDirection?: boolean;
    size?: number;
}> = ({ children, ignoreDirection = false, size = 24 }) => {
    const { direction } = React.useContext(ThemeContext);
    const isRtl = !ignoreDirection && direction === TextDirection.RightToLeft;

    const width = `${size || 24}px`;

    return (
        <svg
            aria-hidden="true"
            className={classNames({
                'rpv-core__icon': true,
                'rpv-core__icon--rtl': isRtl,
            })}
            focusable="false"
            height={width}
            viewBox="0 0 24 24"
            width={width}
        >
            {children}
        </svg>
    );
};
