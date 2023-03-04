/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { Store } from '@react-pdf-viewer/core';
import * as React from 'react';
import {
    addFullScreenChangeListener,
    exitFullScreenMode,
    getFullScreenElement,
    isFullScreenEnabled,
    requestFullScreen,
} from './fullScreen';
import { FullScreenMode } from './structs/FullScreenMode';
import type { StoreProps } from './types/StoreProps';
import type { Zoom } from './types/Zoom';

export const useEnterFullScreen = (
    getFullScreenTarget: (pagesContainer: HTMLElement) => HTMLElement,
    store: Store<StoreProps>,
    onEnterFullScreen: (zoom: Zoom) => void,
    onExitFullScreen: (zoom: Zoom) => void
): {
    enterFullScreen: () => void;
    exitFullScreen: () => void;
    isFullScreen: boolean;
} => {
    const [isFullScreen, setFullScreen] = React.useState(false);
    const pagesRef = React.useRef<HTMLElement | null>(
        store.get('getPagesContainer') ? store.get('getPagesContainer')() : null
    );

    const closeOtherFullScreen = () => {
        const pagesEle = pagesRef.current;
        if (!pagesEle) {
            return Promise.resolve();
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

        const pagesEle = store.get('getPagesContainer')();
        if (!pagesEle) {
            return;
        }
        closeOtherFullScreen().then(() => {
            store.update('fullScreenMode', FullScreenMode.Entering);
            requestFullScreen(getFullScreenTarget(pagesEle));
        });
    };

    const onFullScreenChange = (): void => {
        const ele = getFullScreenElement();
        const pagesEle = pagesRef.current;
        const isFullScreenMode = ele === getFullScreenTarget(pagesEle);
        store.update('isFullScreen', isFullScreenMode);
        isFullScreenMode
            ? pagesEle.classList.add('rpv-full-screen__pages')
            : pagesEle.classList.remove('rpv-full-screen__pages');

        const zoom = store.get('zoom');
        if (zoom) {
            isFullScreenMode ? onEnterFullScreen(zoom) : onExitFullScreen(zoom);
        }
    };

    const handleFullScreen = (fullScreen: boolean) => {
        setFullScreen(fullScreen);
    };

    const exitFullScreen = () => {
        store.update('fullScreenMode', FullScreenMode.Normal);
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
            exitFullScreenMode(document);
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
