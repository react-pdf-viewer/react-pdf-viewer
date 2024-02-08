/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
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
