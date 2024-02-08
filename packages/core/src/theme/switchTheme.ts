/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import { type Theme } from '../types/Theme';

const THEME_ATTR = 'data-rpv-theme';

export const switchTheme = (theme: Theme): void => {
    const root = document.documentElement;
    if (root.getAttribute(THEME_ATTR) === theme.name) {
        return;
    }
    root.setAttribute(THEME_ATTR, theme.name);

    // Set color variables
    root.style.setProperty('--rpv-color-primary', theme.colors.primary);
    root.style.setProperty('--rpv-color-primary-content', theme.colors.primaryContent);
    root.style.setProperty('--rpv-color-secondary', theme.colors.secondary);
    root.style.setProperty('--rpv-color-secondary-content', theme.colors.secondaryContent);
    root.style.setProperty('--rpv-color-accent', theme.colors.accent);
    root.style.setProperty('--rpv-color-accent-content', theme.colors.accentContent);
    root.style.setProperty('--rpv-color-neutral', theme.colors.neutral);
    root.style.setProperty('--rpv-color-neutral-content', theme.colors.neutralContent);
    root.style.setProperty('--rpv-color-base', theme.colors.base);
    root.style.setProperty('--rpv-color-base-content', theme.colors.baseContent);
    root.style.setProperty('--rpv-color-error', theme.colors.error);
    root.style.setProperty('--rpv-color-error-content', theme.colors.errorContent);

    // Set border radius variables
    root.style.setProperty('--rpv-radius-sm', theme.radius.sm);
    root.style.setProperty('--rpv-radius-md', theme.radius.md);
    root.style.setProperty('--rpv-radius-lg', theme.radius.lg);
};
