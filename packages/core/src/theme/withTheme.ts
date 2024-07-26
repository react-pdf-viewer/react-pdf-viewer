/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';
import { isDarkMode } from '../utils/isDarkMode';
import { DARK_THEME } from './darkTheme';
import { LIGHT_THEME } from './lightTheme';
import { useTheme } from './useTheme';

export const withTheme = (theme: string): [string, (theme: string) => void] => {
    const initialTheme = React.useMemo(() => (theme === 'auto' ? (isDarkMode() ? 'dark' : 'light') : theme), []);
    const [currentTheme, setCurrentTheme] = React.useState(initialTheme);

    useTheme(currentTheme === 'light' ? LIGHT_THEME : DARK_THEME);

    React.useEffect(() => {
        if (theme !== 'auto') {
            return;
        }

        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (e: MediaQueryListEvent) => {
            setCurrentTheme(e.matches ? 'dark' : 'light');
        };

        media.addEventListener('change', handler);
        return () => media.removeEventListener('change', handler);
    }, []);

    return [currentTheme, setCurrentTheme];
};
