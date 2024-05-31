/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';
import { TextDirection, ThemeContext } from '../theme/ThemeContext';
import { classNames } from '../utils/classNames';

export const Button: React.FC<{
    children?: React.ReactNode;
    testId?: string;
    onClick(): void;
}> = ({ children, testId, onClick }) => {
    const { direction } = React.useContext(ThemeContext);
    const isRtl = direction === TextDirection.RightToLeft;

    const attrs = testId ? { 'data-testid': testId } : {};
    return (
        <button
            className={classNames({
                'rpv-core__button': true,
                'rpv-core__button--rtl': isRtl,
            })}
            type="button"
            onClick={onClick}
            {...attrs}
        >
            {children}
        </button>
    );
};
