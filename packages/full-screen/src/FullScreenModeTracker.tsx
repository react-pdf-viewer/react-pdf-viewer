/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { Rect, Store } from '@react-pdf-viewer/core';
import { ScrollMode } from '@react-pdf-viewer/core';
import * as React from 'react';
import { addFullScreenChangeListener, getFullScreenElement, removeFullScreenChangeListener } from './fullScreen';
import { FullScreenMode } from './structs/FullScreenMode';
import type { StoreProps } from './types/StoreProps';
import type { Zoom } from './types/Zoom';
import { useWindowResize } from './useWindowResize';

const ZERO_RECT = {
    height: 0,
    width: 0,
};

export const FullScreenModeTracker: React.FC<{
    getFullScreenTarget(pagesContainer: HTMLElement): HTMLElement;
    pagesContainerRef: React.RefObject<HTMLDivElement>;
    store: Store<StoreProps>;
    onEnterFullScreen: (zoom: Zoom) => void;
    onExitFullScreen: (zoom: Zoom) => void;
}> = ({ getFullScreenTarget, pagesContainerRef, store, onEnterFullScreen, onExitFullScreen }) => {
    const windowRect = useWindowResize();
    const [targetRect, setTargetRect] = React.useState<Rect>(ZERO_RECT);
    const windowSizeBeforeFullScreenRef = React.useRef<Rect>(ZERO_RECT);
    const targetPageRef = React.useRef(store.get('currentPage'));

    // Keep the current page when users enter or exit the full scroll mode
    const scrollToCurrentPage = () => {
        if (store.get('scrollMode') === ScrollMode.Page) {
            store.get('jumpToPage')(targetPageRef.current);
        }
    };

    const handleFullScreenMode = React.useCallback((fullScreenMode: FullScreenMode) => {
        const zoom = store.get('zoom');
        switch (fullScreenMode) {
            case FullScreenMode.Entering:
                // Store the latest window size right after entering the full screen mode
                targetPageRef.current = store.get('currentPage');
                windowSizeBeforeFullScreenRef.current = {
                    height: window.innerHeight,
                    width: window.innerWidth,
                };
                break;

            // Entering the full screen mode completes
            case FullScreenMode.Entered:
                pagesContainerRef.current.classList.add('rpv-full-screen__pages');
                scrollToCurrentPage();
                onEnterFullScreen(zoom);
                break;

            case FullScreenMode.Exitting:
                targetPageRef.current = store.get('currentPage');
                break;

            // Exitting the full screen mode completes
            case FullScreenMode.Exited:
                pagesContainerRef.current.classList.remove('rpv-full-screen__pages');
                store.update('fullScreenMode', FullScreenMode.Normal);
                scrollToCurrentPage();
                onExitFullScreen(zoom);
                break;

            default:
                break;
        }
    }, []);

    const handleFullScreenChange = React.useCallback(() => {
        const pagesContainer = pagesContainerRef.current;
        if (!pagesContainer) {
            return;
        }
        const fullScreenTarget = getFullScreenTarget(pagesContainer);
        const fullScreenEle = getFullScreenElement();
        if (fullScreenEle !== fullScreenTarget) {
            store.update('fullScreenMode', FullScreenMode.Exitting);
        }
    }, []);

    React.useEffect(() => {
        if (
            windowRect.height === targetRect.height &&
            windowRect.width === targetRect.width &&
            windowRect.height > 0 &&
            windowRect.width > 0
        ) {
            store.update('fullScreenMode', FullScreenMode.Entered);
            return;
        }

        if (
            store.get('fullScreenMode') === FullScreenMode.Exitting &&
            windowSizeBeforeFullScreenRef.current.height === windowRect.height &&
            windowSizeBeforeFullScreenRef.current.width === windowRect.width &&
            windowRect.height > 0 &&
            windowRect.width > 0
        ) {
            store.update('fullScreenMode', FullScreenMode.Exited);
        }
    }, [windowRect, targetRect]);

    React.useEffect(() => {
        const pagesContainer = pagesContainerRef.current;
        if (!pagesContainer) {
            return;
        }
        const fullScreenTarget = getFullScreenTarget(pagesContainer);
        const io = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                const { height, width } = entry.target.getBoundingClientRect();
                setTargetRect({ height, width });
            });
        });
        io.observe(fullScreenTarget);

        addFullScreenChangeListener(handleFullScreenChange);

        return (): void => {
            io.unobserve(fullScreenTarget);
            io.disconnect();

            removeFullScreenChangeListener(handleFullScreenChange);
        };
    }, []);

    React.useEffect(() => {
        store.subscribe('fullScreenMode', handleFullScreenMode);

        return (): void => {
            store.unsubscribe('fullScreenMode', handleFullScreenMode);
        };
    }, []);

    return <></>;
};
