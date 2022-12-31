/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

export enum TextDirection {
    RightToLeft = 'RTL',
    LeftToRight = 'LTR',
}

export interface ThemeContextProps {
    currentTheme: string;
    direction?: TextDirection;
    setCurrentTheme: (theme: string) => void;
}

export const ThemeContext = React.createContext<ThemeContextProps>({
    currentTheme: 'light',
    direction: TextDirection.LeftToRight,
    setCurrentTheme: () => {},
});
