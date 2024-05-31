/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';
import { useEscapeStack } from './useEscapeStack';

export const PopoverOverlay: React.FC<{
    children: React.ReactNode;
    closeOnEscape: boolean;
    onClose(): void;
}> = ({ children, closeOnEscape, onClose }) => {
    const containerRef = React.useRef<HTMLDivElement>();

    useEscapeStack(() => {
        if (closeOnEscape) {
            onClose();
        }
    });

    return (
        <div className="rpv-core__popover-overlay" ref={containerRef}>
            {children}
        </div>
    );
};
