/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { type Theme } from '../types/Theme';

export const LIGHT_THEME: Theme = {
    name: 'light',
    variables: {
        border: '240 5.9% 90%',
        radius: '0.5rem',
        ring: '240 5% 64.9%',
        background: '0 0% 100%',
        foreground: '240 10% 3.9%',
        muted: '240 4.8% 95.9%',
        mutedForeground: '240 3.8% 46.1%',
        primary: '240 5.9% 10%',
        primaryForeground: '0 0% 98%',
        secondary: '240 4.8% 95.9%',
        secondaryForeground: '240 5.9% 10%',
        accent: '240 4.8% 95.9%',
        accentForeground: '240 5.9% 10%',
        destructive: '0 72.22% 50.59%',
        destructiveForeground: '0 0% 98%',
        highlight: '80.9 95.67% 54.71%',
    },
};
