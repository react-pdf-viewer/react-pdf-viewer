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

export const TextBox: React.FC<{
    ariaLabel?: string;
    autoFocus?: boolean;
    placeholder?: string;
    type?: 'text' | 'password';
    value?: string;
    onChange: (value: string) => void;
    onKeyDown?: (e: React.KeyboardEvent) => void;
}> = ({
    ariaLabel = '',
    autoFocus = false,
    placeholder = '',
    type = 'text',
    value = '',
    onChange,
    onKeyDown = () => {},
}) => {
    const { direction } = React.useContext(ThemeContext);
    const isRtl = direction === TextDirection.RightToLeft;

    const attrs = {
        'aria-label': ariaLabel,
        autoFocus,
        className: classNames({
            'rpv-core__textbox': true,
            'rpv-core__textbox--rtl': isRtl,
        }),
        placeholder,
        value,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
        onKeyDown,
    };

    return type === 'text' ? <input type="text" {...attrs} /> : <input type="password" {...attrs} />;
};
