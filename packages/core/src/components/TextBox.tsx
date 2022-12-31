/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
import { TextDirection, ThemeContext } from '../theme/ThemeContext';
import { classNames } from '../utils/classNames';

export const TextBox: React.FC<{
    ariaLabel?: string;
    autoFocus?: boolean;
    placeholder?: string;
    testId?: string;
    type?: 'text' | 'password';
    value?: string;
    onChange: (value: string) => void;
    onKeyDown?: (e: React.KeyboardEvent) => void;
}> = ({
    ariaLabel = '',
    autoFocus = false,
    placeholder = '',
    testId,
    type = 'text',
    value = '',
    onChange,
    onKeyDown = () => {},
}) => {
    const { direction } = React.useContext(ThemeContext);
    const textboxRef = React.useRef<HTMLInputElement>();
    const isRtl = direction === TextDirection.RightToLeft;

    const attrs = {
        ref: textboxRef,
        'data-testid': '',
        'aria-label': ariaLabel,
        className: classNames({
            'rpv-core__textbox': true,
            'rpv-core__textbox--rtl': isRtl,
        }),
        placeholder,
        value,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
        onKeyDown,
    };
    if (testId) {
        attrs['data-testid'] = testId;
    }

    useIsomorphicLayoutEffect(() => {
        if (autoFocus) {
            const textboxEle = textboxRef.current;
            // The `focus({ preventScroll: true })` isn't suppored in all browsers
            // See https://wpt.fyi/results/html/interaction/focus/processing-model/preventScroll.html
            if (textboxEle) {
                const x = window.scrollX;
                const y = window.scrollY;
                textboxEle.focus();
                // Scroll to the previous position
                window.scrollTo(x, y);
            }
        }
    }, []);

    return type === 'text' ? <input type="text" {...attrs} /> : <input type="password" {...attrs} />;
};
