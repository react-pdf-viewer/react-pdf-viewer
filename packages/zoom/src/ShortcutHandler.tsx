/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Store } from '@react-pdf-viewer/core';

import StoreProps from './StoreProps';
import { decrease, increase } from './zoomingLevel';

interface ShortcutHandlerProps {
    containerRef: React.RefObject<HTMLDivElement>
    store: Store<StoreProps>;
}

const isMac = () => (typeof window !== "undefined") ? /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform) : false;

const ShortcutHandler: React.FC<ShortcutHandlerProps> = ({ containerRef, store }) => {
    const keydownHandler = (e: KeyboardEvent) => {
        if (e.shiftKey || e.altKey) {
            return;
        }
        const isCommandPressed = isMac() ? e.metaKey : e.ctrlKey;
        if (!isCommandPressed) {
            return;
        }

        const containerEle = containerRef.current;
        if (!containerEle || !document.activeElement || !document.activeElement.contains(containerEle)) {
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

    return (<></>);
};

export default ShortcutHandler;
 