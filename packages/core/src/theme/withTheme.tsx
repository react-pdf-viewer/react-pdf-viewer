/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { usePrevious } from '../hooks/usePrevious';
import { isDarkMode } from '../utils/isDarkMode';

export interface RenderThemeChildrenProps {
    currentTheme: string;
    setCurrentTheme(theme: string): void;
}

export const withTheme = (theme: string, onSwitchTheme?: (theme: string) => void) => {
    const initialTheme = React.useMemo(() => (theme === 'auto' ? (isDarkMode() ? 'dark' : 'light') : theme), []);
    const [currentTheme, setCurrentTheme] = React.useState(initialTheme);
    const prevTheme = usePrevious(currentTheme);

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

    React.useEffect(() => {
        if (currentTheme !== prevTheme && onSwitchTheme) {
            onSwitchTheme(currentTheme);
        }
    }, [currentTheme]);

    React.useEffect(() => {
        if (theme !== currentTheme) {
            setCurrentTheme(theme);
        }
    }, [theme]);

    return {
        currentTheme,
        setCurrentTheme,
    };
};
