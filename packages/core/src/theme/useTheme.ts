/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';
import { type Theme } from '../types/Theme';

const THEME_ATTR = 'data-rpv-theme';

export const useTheme = (theme: Theme): void => {
    const addStyles = React.useCallback(() => {
        const root = document.documentElement;
        root.setAttribute(THEME_ATTR, theme.name);

        if (document.head.querySelector(`style[${THEME_ATTR}="${theme.name}"]`)) {
            return;
        }

        // Build a `style` element containing theme definitions
        const styleEle = document.createElement('style');
        styleEle.setAttribute(THEME_ATTR, theme.name);
        document.head.appendChild(styleEle);

        // Set color variables
        styleEle.textContent = `
:root[${THEME_ATTR}="${theme.name}"] {
    --rpv-color-primary: ${theme.colors.primary};
    --rpv-color-primary-content: ${theme.colors.primaryContent};
    --rpv-color-secondary: ${theme.colors.secondary};
    --rpv-color-secondary-content: ${theme.colors.secondaryContent};
    --rpv-color-accent: ${theme.colors.accent};
    --rpv-color-accent-content: ${theme.colors.accentContent};
    --rpv-color-neutral: ${theme.colors.neutral};
    --rpv-color-neutral-content: ${theme.colors.neutralContent};
    --rpv-color-base: ${theme.colors.base};
    --rpv-color-base-content: ${theme.colors.baseContent};
    --rpv-color-error: ${theme.colors.error};
    --rpv-color-error-content: ${theme.colors.errorContent};
    --rpv-radius-sm: ${theme.radius.sm};
    --rpv-radius-md: ${theme.radius.md};
    --rpv-radius-lg: ${theme.radius.lg};
}`;
    }, [theme]);

    const removeStyles = React.useCallback(() => {
        const styleEle = document.head.querySelector(`style[${THEME_ATTR}="${theme.name}"]`);
        if (styleEle) {
            document.head.removeChild(styleEle);
        }
    }, [theme]);

    React.useEffect(() => {
        addStyles();
        return () => {
            removeStyles();
        };
    }, [theme]);
};
