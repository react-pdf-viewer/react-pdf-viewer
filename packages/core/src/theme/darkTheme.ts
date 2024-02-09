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
        primary: '',
        primaryContent: '',
        secondary: '',
        secondaryContent: '',
        accent: '',
        accentContent: '',
        neutral: '#2a323c',
        neutralContent: '#a6adbb',
        base: '',
        baseContent: '',
        error: '#ff6f70',
        errorContent: '#000',
    },
    radius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '1rem',
    },
};
