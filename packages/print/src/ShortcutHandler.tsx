/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import type { Store } from '@react-pdf-viewer/core/lib';

import PrintStatus from './PrintStatus';
import StoreProps from './StoreProps';
import isMac from './utils/isMac';

interface ShortcutHandlerProps {
    containerRef: React.RefObject<HTMLDivElement>;
    store: Store<StoreProps>;
}

const ShortcutHandler: React.FC<ShortcutHandlerProps> = ({ containerRef, store }) => {
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

export default ShortcutHandler;
