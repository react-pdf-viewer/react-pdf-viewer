/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { type Theme } from '../types/Theme';

export const DARK_THEME: Theme = {
    name: 'dark',
    colors: {
        primary: '117, 130, 255',
        primaryContent: '5, 6, 23',
        secondary: '255, 113, 207',
        secondaryContent: '25, 2, 17',
        accent: '0, 199, 181',
        accentContent: '0, 14, 12',
        neutral: '42, 50, 60',
        neutralContent: '166, 173, 187',
        base: '29, 35, 42',
        baseDarker: '25, 30, 36',
        baseMoreDarker: '21, 25, 30',
        baseContent: '166, 173, 187',
        error: '255, 111, 112',
        errorContent: '0, 0, 0',
    },
    radius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '1rem',
    },
};
