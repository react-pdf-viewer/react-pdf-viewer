/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';
import styles from '../styles/popoverOverlay.module.css';
import { useEscapeStack } from './useEscapeStack';

export const PopoverOverlay: React.FC<{
    children: React.ReactNode;
    closeOnEscape: boolean;
    onClose(): void;
}> = ({ children, closeOnEscape, onClose }) => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    useEscapeStack(() => {
        if (closeOnEscape) {
            onClose();
        }
    });

    return (
        <div className={styles.overlay} ref={containerRef}>
            {children}
        </div>
    );
};
