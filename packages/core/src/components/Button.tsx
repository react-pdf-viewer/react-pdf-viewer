/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import { TextDirection, ThemeContext } from '../theme/ThemeContext';
import { classNames } from '../utils/classNames';

export const Button: React.FC<{
    onClick(): void;
}> = ({ children, onClick }) => {
    const { direction } = React.useContext(ThemeContext);
    const isRtl = direction === TextDirection.RightToLeft;

    return (
        <button 
            className={classNames({
                'rpv-core__button': true,
                'rpv-core__button--rtl': isRtl,
            })}
            type="button"
            onClick={onClick}
        >
            {children}
        </button>
    );
};
