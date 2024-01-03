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
import { decrease, increase } from './zoomingLevel';

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
            if (!element || e.shiftKey || e.altKey) {
                return;
            }
            const isCommandPressed = isMac() ? e.metaKey : e.ctrlKey;
            if (!isCommandPressed) {
                return;
            }
            if (!document.activeElement || !element.contains(document.activeElement)) {
                return;
            }
            const zoom = store.get('zoom');
            if (!zoom) {
                return;
            }

            const scale = store.get('scale') || 1;
            let newScale = 1;
            switch (e.key) {
                case '-':
                    newScale = decrease(scale);
                    break;
                case '=':
                    newScale = increase(scale);
                    break;
                case '0':
                    newScale = 1;
                    break;
                default:
                    newScale = scale;
                    break;
            }

            if (newScale !== scale) {
                e.preventDefault();
                zoom(newScale);
            }
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
