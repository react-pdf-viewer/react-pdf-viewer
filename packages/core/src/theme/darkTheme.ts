/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { type Theme } from '../types/Theme';

export const DARK_THEME: Theme = {
    name: 'dark',
    variables: {
        border: '240 3.7% 15.9%',
        radius: '0.5rem',
        ring: '240 4.9% 83.9%',
        background: '240 10% 3.9%',
        foreground: '0 0% 98%',
        muted: '240 3.7% 15.9%',
        mutedForeground: '240 5% 64.9%',
        primary: '0 0% 98%',
        primaryForeground: '240 5.9% 10%',
        secondary: '240 3.7% 15.9%',
        secondaryForeground: '0 0% 98%',
        accent: '240 3.7% 15.9%',
        accentForeground: '0 0% 98%',
        destructive: '0 62.8% 30.6%',
        destructiveForeground: '0 85.7% 97.3%',
        highlight: '80.9 95.67% 54.71%',
    },
};
