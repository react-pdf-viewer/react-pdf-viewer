/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { type Theme } from '../types/Theme';

export const LIGHT_THEME: Theme = {
    name: 'light',
    colors: {
        primary: '73, 30, 255',
        primaryContent: '212, 219, 255',
        secondary: '255, 65, 199',
        secondaryContent: '255, 249, 252',
        accent: '0, 207, 189',
        accentContent: '0, 16, 13',
        neutral: '43, 52, 64',
        neutralContent: '215, 221, 228',
        base: '255, 255, 255',
        baseDarker: '242, 242, 242',
        baseMoreDarker: '210, 210, 210',
        baseContent: '31, 41, 55',
        error: '255, 111, 112',
        errorContent: '0, 0, 0',
    },
    radius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '1rem',
    },
};
