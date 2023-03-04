/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { Rect, Store } from '@react-pdf-viewer/core';
import { useDebounceCallback, useIsomorphicLayoutEffect } from '@react-pdf-viewer/core';
import * as React from 'react';
import { FullScreenMode } from './structs/FullScreenMode';
import type { StoreProps } from './types/StoreProps';

const RESIZE_EVENT_OPTIONS = {
    capture: false,
    passive: true,
};

const ZERO_RECT = {
    height: 0,
    width: 0,
};

export const FullScreenModeTracker: React.FC<{
    getFullScreenTarget(pagesContainer: HTMLElement): HTMLElement;
    pagesContainerRef: React.RefObject<HTMLDivElement>;
    store: Store<StoreProps>;
}> = ({ getFullScreenTarget, pagesContainerRef, store }) => {
    const [windowRect, setWindowRect] = React.useState<Rect>(ZERO_RECT);
    const [targetRect, setTargetRect] = React.useState<Rect>(ZERO_RECT);

    const handleResize = useDebounceCallback(() => {
        setWindowRect({
            height: window.innerHeight,
            width: window.innerWidth,
        });
    }, 100);

    const handleFullScreenMode = React.useCallback((fullScreenMode: FullScreenMode) => {}, []);

    React.useEffect(() => {
        if (
            windowRect.height === targetRect.height &&
            windowRect.width === targetRect.width &&
            targetRect.height > 0 &&
            targetRect.width > 0
        ) {
            store.update('fullScreenMode', FullScreenMode.Entered);
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

        return (): void => {
            io.unobserve(fullScreenTarget);
            io.disconnect();
        };
    }, []);

    React.useEffect(() => {
        store.subscribe('fullScreenMode', handleFullScreenMode);

        return (): void => {
            store.unsubscribe('fullScreenMode', handleFullScreenMode);
        };
    }, []);

    useIsomorphicLayoutEffect(() => {
        window.addEventListener('resize', handleResize, RESIZE_EVENT_OPTIONS);

        return () => {
            window.removeEventListener('resize', handleResize, RESIZE_EVENT_OPTIONS);
        };
    }, []);

    return <></>;
};
