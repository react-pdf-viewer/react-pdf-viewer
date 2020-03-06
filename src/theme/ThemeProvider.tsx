/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import ThemeContext from './ThemeContext';

interface ThemeProviderProps {
    prefixClass?: string;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, prefixClass }) => {
    return (
        <ThemeContext.Provider value={{ prefixClass: prefixClass || 'viewer'}}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
