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
    --rpv-border: ${theme.variables.border};
    --rpv-radius: ${theme.variables.radius};
    --rpv-ring: ${theme.variables.ring};
    --rpv-background: ${theme.variables.background};
    --rpv-foreground: ${theme.variables.foreground};
    --rpv-muted: ${theme.variables.muted};
    --rpv-muted-foreground: ${theme.variables.mutedForeground};
    --rpv-primary: ${theme.variables.primary};
    --rpv-primary-foreground: ${theme.variables.primaryForeground};
    --rpv-secondary: ${theme.variables.secondary};
    --rpv-secondary-foreground: ${theme.variables.secondaryForeground};
    --rpv-accent: ${theme.variables.accent};
    --rpv-accent-foreground: ${theme.variables.accentForeground};
    --rpv-destructive: ${theme.variables.destructive};
    --rpv-destructive-foreground: ${theme.variables.destructiveForeground};
    --rpv-highlight: ${theme.variables.highlight};
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
