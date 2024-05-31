/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

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
