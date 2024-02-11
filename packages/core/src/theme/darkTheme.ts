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
    colors: {
        primary: '117, 130, 255',
        primaryContent: '5, 6, 23',
        secondary: '',
        secondaryContent: '',
        accent: '',
        accentContent: '',
        neutral: '42, 50, 60',
        neutralContent: '166, 173, 187',
        base: '29, 35, 42',
        baseDarker: '25, 30, 36',
        baseMoreDarker: '',
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
