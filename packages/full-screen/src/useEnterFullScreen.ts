/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { Store } from '@react-pdf-viewer/core';
import * as React from 'react';
import { exitFullScreenMode, getFullScreenElement, isFullScreenEnabled, requestFullScreen } from './fullScreen';
import { FullScreenMode } from './structs/FullScreenMode';
import type { StoreProps } from './types/StoreProps';

export const useEnterFullScreen = (
    getFullScreenTarget: (pagesContainer: HTMLElement) => HTMLElement,
    store: Store<StoreProps>
): {
    enterFullScreen: () => void;
    exitFullScreen: () => void;
    isFullScreen: boolean;
} => {
    const [isFullScreen, setFullScreen] = React.useState(false);

    const closeOtherFullScreen = () => {
        const getPagesContainer = store.get('getPagesContainer');
        if (!getPagesContainer) {
            return;
        }
        const pagesEle = getPagesContainer();
        if (!pagesEle) {
            return;
        }

        const ele = getFullScreenElement();
        if (ele && ele !== getFullScreenTarget(pagesEle)) {
            store.update('fullScreenMode', FullScreenMode.Normal);
            return exitFullScreenMode(ele);
        }

        return Promise.resolve();
    };

    const enterFullScreen = () => {
        if (!isFullScreenEnabled()) {
            return;
        }

        const getPagesContainer = store.get('getPagesContainer');
        if (!getPagesContainer) {
            return;
        }
        const pagesEle = getPagesContainer();
        if (!pagesEle) {
            return;
        }
        closeOtherFullScreen().then(() => {
            store.update('fullScreenMode', FullScreenMode.Entering);
            requestFullScreen(getFullScreenTarget(pagesEle));
        });
    };

    const handleFullScreen = (fullScreen: boolean) => {
        setFullScreen(fullScreen);
    };

    const exitFullScreen = () => {
        setFullScreen(false);

        const getPagesContainer = store.get('getPagesContainer');
        if (!getPagesContainer) {
            return;
        }
        const pagesEle = getPagesContainer();
        if (!pagesEle) {
            return;
        }

        const ele = getFullScreenElement();
        if (ele && ele === getFullScreenTarget(pagesEle)) {
            exitFullScreenMode(document).then(() => {
                store.update('fullScreenMode', FullScreenMode.Exitting);
            });
        }
    };

    React.useEffect(() => {
        store.subscribe('isFullScreen', handleFullScreen);

        return (): void => {
            store.unsubscribe('isFullScreen', handleFullScreen);
        };
    }, []);

    return {
        enterFullScreen,
        exitFullScreen,
        isFullScreen,
    };
};
