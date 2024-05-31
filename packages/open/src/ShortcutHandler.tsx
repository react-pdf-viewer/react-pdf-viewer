/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
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

    const handleDocumentKeyDown = React.useCallback(
        (e: KeyboardEvent) => {
            if (!element || e.shiftKey || e.altKey || e.key !== 'o') {
                return;
            }
            const isCommandPressed = isMac() ? e.metaKey : e.ctrlKey;
            if (!isCommandPressed) {
                return;
            }
            if (!document.activeElement || !element.contains(document.activeElement)) {
                return;
            }

            e.preventDefault();
            store.update('triggerOpenFile', true);
        },
        [element],
    );

    React.useEffect(() => {
        if (!element) {
            return;
        }
        document.addEventListener('keydown', handleDocumentKeyDown);

        return () => {
            document.removeEventListener('keydown', handleDocumentKeyDown);
        };
    }, [element]);

    return <></>;
};
