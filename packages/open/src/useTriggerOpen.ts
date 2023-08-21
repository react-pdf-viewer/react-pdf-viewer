/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { type Store } from '@react-pdf-viewer/core';
import * as React from 'react';
import { type StoreProps } from './types/StoreProps';

export const useTriggerOpen = (
    store: Store<StoreProps>,
): {
    inputRef: React.MutableRefObject<HTMLInputElement>;
    openFile: () => void;
} => {
    const inputRef = React.useRef<HTMLInputElement>();

    const openFile = () => {
        const inputEle = inputRef.current;
        if (inputEle) {
            inputEle.click();
            if (store.get('triggerOpenFile')) {
                store.update('triggerOpenFile', false);
            }
        }
    };

    const handleOpenFileTriggered = (trigger: boolean) => {
        if (trigger) {
            openFile();
        }
    };

    React.useEffect(() => {
        store.subscribe('triggerOpenFile', handleOpenFileTriggered);

        return () => {
            store.unsubscribe('triggerOpenFile', handleOpenFileTriggered);
        };
    }, []);

    return {
        inputRef,
        openFile,
    };
};
