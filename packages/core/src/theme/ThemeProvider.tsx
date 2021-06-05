/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import ThemeContext from './ThemeContext';

type SetTheme = (theme: string) => void;

interface ThemeProviderProps {
    children: (currentTheme: string, setTheme: SetTheme) => React.ReactElement;
    theme?: string;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, theme }) => {
    const [currentTheme, setCurrentTheme] = React.useState(theme || '');

    return (
        <ThemeContext.Provider value={currentTheme}>
            {children(currentTheme, setCurrentTheme)}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
