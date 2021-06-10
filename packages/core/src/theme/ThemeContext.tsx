/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

export interface ThemeContextProps {
    currentTheme: string;
    setCurrentTheme: (theme: string) => void;
}
const ThemeContext = React.createContext<ThemeContextProps>({
    currentTheme: 'light',
    setCurrentTheme: () => {},
});

export default ThemeContext;
