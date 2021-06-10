/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import ThemeContext, { ThemeContextProps } from './ThemeContext';
import isDarkMode from '../utils/isDarkMode';

interface ThemeProviderProps {
    theme: string;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, theme }) => {
    const initialTheme = React.useMemo(() => theme === 'auto' ? (isDarkMode() ? 'dark' : 'light') : theme, []);
    const [currentTheme, setCurrentTheme] = React.useState(initialTheme);

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

    const initialContext: ThemeContextProps = {
        currentTheme,
        setCurrentTheme,
    };

    return (
        <ThemeContext.Provider value={initialContext}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
