/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

export interface Theme {
    name: string;
    colors: {
        primary: string;
        // Foreground content color used on primary color
        primaryContent?: string;
        secondary: string;
        secondaryContent?: string;
        accent: string;
        accentContent?: string;
        neutral: string;
        neutralContent?: string;
        base: string;
        baseDarker?: string;
        baseMoreDarker?: string;
        baseContent?: string;
        error?: string;
        errorContent?: string;
    };
    radius: {
        sm: string;
        md: string;
        lg: string;
    };
}
