/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { isMac, type Store } from '@react-pdf-viewer/core';
import * as React from 'react';
import { PrintStatus } from './structs/PrintStatus';
import { type StoreProps } from './types/StoreProps';

export const ShortcutHandler: React.FC<{
    containerRef: React.RefObject<HTMLDivElement>;
    store: Store<StoreProps>;
}> = ({ containerRef, store }) => {
    const keydownHandler = (e: KeyboardEvent) => {
        if (e.shiftKey || e.altKey || e.key !== 'p') {
            return;
        }

        const isCommandPressed = isMac() ? e.metaKey : e.ctrlKey;
        if (!isCommandPressed) {
            return;
        }

        const containerEle = containerRef.current;
        if (!containerEle || !document.activeElement || !containerEle.contains(document.activeElement)) {
            return;
        }

        e.preventDefault();
        store.update('printStatus', PrintStatus.Preparing);
    };

    React.useEffect(() => {
        const containerEle = containerRef.current;
        if (!containerEle) {
            return;
        }

        document.addEventListener('keydown', keydownHandler);
        return () => {
            document.removeEventListener('keydown', keydownHandler);
        };
    }, [containerRef.current]);

    return <></>;
};
