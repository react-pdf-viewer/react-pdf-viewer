/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { Store } from '@react-pdf-viewer/core';
import { FullScreenMode } from '@react-pdf-viewer/core';
import * as React from 'react';
import type { StoreProps } from './types/StoreProps';

export const useEnterFullScreen = (
    store: Store<StoreProps>
): {
    enterFullScreen: () => void;
    exitFullScreen: () => void;
    isFullScreen: boolean;
} => {
    const [isFullScreen, setFullScreen] = React.useState(false);

    const handleFullScreenMode = React.useCallback((fullScreenMode: FullScreenMode) => {
        setFullScreen(fullScreenMode === FullScreenMode.Entering || fullScreenMode === FullScreenMode.Entered);
    }, []);

    const enterFullScreen = () => {
        store.get('enterFullScreenMode')();
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
        isFullScreen,
    };
};
