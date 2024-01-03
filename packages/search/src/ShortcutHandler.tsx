/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import { isMac, type Store } from '@react-pdf-viewer/core';
import * as React from 'react';
import { type StoreProps } from './types/StoreProps';

export const ShortcutHandler: React.FC<{
    containerRef: React.RefObject<HTMLDivElement>;
    store: Store<StoreProps>;
}> = ({ containerRef, store }) => {
    const [element, setElement] = React.useState(containerRef.current);

    React.useEffect(() => {
        if (containerRef.current !== element) {
            setElement(containerRef.current);
        }
    }, []);

    // Indicate whether the mouse is inside the viewer container or not
    const isMouseInsideRef = React.useRef(false);

    const handleMouseEnter = () => {
        isMouseInsideRef.current = true;
    };

    const handleMouseLeave = () => {
        isMouseInsideRef.current = false;
    };

    const handleDocumentKeyDown = React.useCallback(
        (e: KeyboardEvent) => {
            if (!element) {
                return;
            }
            if (e.shiftKey || e.altKey || e.key !== 'f') {
                return;
            }
            const isCommandPressed = isMac() ? e.metaKey && !e.ctrlKey : e.ctrlKey;
            if (!isCommandPressed) {
                return;
            }

            if (isMouseInsideRef.current || (document.activeElement && element.contains(document.activeElement))) {
                e.preventDefault();
                store.update('areShortcutsPressed', true);
            }
        },
        [element],
    );

    React.useEffect(() => {
        if (!element) {
            return;
        }
        document.addEventListener('keydown', handleDocumentKeyDown);
        element.addEventListener('mouseenter', handleMouseEnter);
        element.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            document.removeEventListener('keydown', handleDocumentKeyDown);
            element.removeEventListener('mouseenter', handleMouseEnter);
            element.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [element]);

    return <></>;
};
