/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import { FullScreenMode, type Store } from '@react-pdf-viewer/core';
import * as React from 'react';
import { type StoreProps } from './types/StoreProps';

export const useEnterFullScreen = (
    getFullScreenTarget: (pagesContainer: HTMLElement) => HTMLElement,
    store: Store<StoreProps>,
): {
    enterFullScreen: () => void;
    exitFullScreen: () => void;
    isFullScreen: boolean;
} => {
    const [fullScreenMode, setFullScreenMode] = React.useState(store.get('fullScreenMode'));

    const handleFullScreenMode = React.useCallback((fullScreenMode: FullScreenMode) => {
        setFullScreenMode(fullScreenMode);
    }, []);

    const enterFullScreen = () => {
        const pagesContainer = store.get('getPagesContainer');
        if (!pagesContainer) {
            return;
        }
        const target = getFullScreenTarget(pagesContainer());
        store.get('enterFullScreenMode')(target);
    };

    const exitFullScreen = () => {
        store.get('exitFullScreenMode')();
    };

    React.useEffect(() => {
        store.subscribe('fullScreenMode', handleFullScreenMode);

        return (): void => {
            store.unsubscribe('fullScreenMode', handleFullScreenMode);
        };
    }, []);

    return {
        enterFullScreen,
        exitFullScreen,
        isFullScreen: fullScreenMode === FullScreenMode.Entering || fullScreenMode === FullScreenMode.Entered,
    };
};
