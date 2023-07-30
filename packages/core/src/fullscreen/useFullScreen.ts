/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
import { useWindowResize } from '../hooks/useWindowResize';
import { FullScreenMode } from '../structs/FullScreenMode';
import { ScrollMode } from '../structs/ScrollMode';
import { type Rect } from '../types/Rect';
import {
    addFullScreenChangeListener,
    exitFullScreen,
    getFullScreenElement,
    isFullScreenEnabled,
    removeFullScreenChangeListener,
    requestFullScreen,
} from './fullScreen';

const ZERO_RECT = {
    height: 0,
    width: 0,
};

export const useFullScreen = ({
    getCurrentPage,
    getCurrentScrollMode,
    jumpToPage,
    targetRef,
}: {
    getCurrentPage: () => number;
    getCurrentScrollMode: () => ScrollMode;
    jumpToPage: (pageIndex: number) => Promise<void>;
    targetRef: React.MutableRefObject<HTMLElement>;
}) => {
    const [fullScreenMode, setFullScreenMode] = React.useState(FullScreenMode.Normal);
    const windowRect = useWindowResize();
    const [targetRect, setTargetRect] = React.useState<Rect>(ZERO_RECT);
    const windowSizeBeforeFullScreenRef = React.useRef<Rect>(ZERO_RECT);
    const targetPageRef = React.useRef(getCurrentPage());

    const fullScreenSizeRef = React.useRef<Rect>(ZERO_RECT);
    const [element, setElement] = React.useState<HTMLElement>(targetRef.current);

    const fullScreenElementRef = React.useRef<HTMLElement>();

    useIsomorphicLayoutEffect(() => {
        if (targetRef.current !== element) {
            setElement(targetRef.current);
        }
    }, []);

    useIsomorphicLayoutEffect(() => {
        if (!element) {
            return;
        }
        const io = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                const { height, width } = entry.target.getBoundingClientRect();
                setTargetRect({ height, width });
            });
        });
        io.observe(element);

        return (): void => {
            io.unobserve(element);
            io.disconnect();
        };
    }, [element]);

    const closeOtherFullScreen = React.useCallback((target: HTMLElement) => {
        const currentFullScreenEle = getFullScreenElement();
        if (currentFullScreenEle && currentFullScreenEle !== target) {
            setFullScreenMode(FullScreenMode.Normal);
            return exitFullScreen(currentFullScreenEle);
        }

        return Promise.resolve();
    }, []);

    const enterFullScreenMode = React.useCallback((target: HTMLElement) => {
        if (!target || !isFullScreenEnabled()) {
            return;
        }
        setElement(target);
        closeOtherFullScreen(target).then(() => {
            fullScreenElementRef.current = target;
            setFullScreenMode(FullScreenMode.Entering);
            requestFullScreen(target);
        });
    }, []);

    const exitFullScreenMode = React.useCallback(() => {
        const currentFullScreenEle = getFullScreenElement();
        if (currentFullScreenEle) {
            setFullScreenMode(FullScreenMode.Exitting);
            exitFullScreen(document);
        }
    }, []);

    const handleFullScreenChange = React.useCallback(() => {
        if (!element) {
            return;
        }
        const currentFullScreenEle = getFullScreenElement();
        if (currentFullScreenEle !== element) {
            setFullScreenMode(FullScreenMode.Exitting);
        }
    }, [element]);

    React.useEffect(() => {
        switch (fullScreenMode) {
            case FullScreenMode.Entering:
                // It's not possible to add a CSS class to target
                // We have to set an inline style to avoid the black backdrop
                if (fullScreenElementRef.current) {
                    fullScreenElementRef.current.style.backgroundColor =
                        'var(--rpv-core__full-screen-target-background-color)';
                }
                // Store the latest window size right after entering the full screen mode
                targetPageRef.current = getCurrentPage();
                windowSizeBeforeFullScreenRef.current = {
                    height: window.innerHeight,
                    width: window.innerWidth,
                };
                break;

            // Entering the full screen mode completes
            case FullScreenMode.Entered:
                if (getCurrentScrollMode() === ScrollMode.Page) {
                    jumpToPage(targetPageRef.current).then(() => {
                        setFullScreenMode(FullScreenMode.EnteredCompletely);
                    });
                } else {
                    setFullScreenMode(FullScreenMode.EnteredCompletely);
                }
                break;

            case FullScreenMode.Exitting:
                if (fullScreenElementRef.current) {
                    fullScreenElementRef.current.style.backgroundColor = '';
                    fullScreenElementRef.current = null;
                }
                targetPageRef.current = getCurrentPage();
                break;

            // Exitting the full screen mode completes
            case FullScreenMode.Exited:
                setFullScreenMode(FullScreenMode.Normal);
                if (getCurrentScrollMode() === ScrollMode.Page) {
                    jumpToPage(targetPageRef.current);
                }
                break;

            default:
                break;
        }
    }, [fullScreenMode]);

    React.useEffect(() => {
        if (fullScreenMode === FullScreenMode.Normal) {
            return;
        }

        if (
            fullScreenMode === FullScreenMode.Entering &&
            windowRect.height === targetRect.height &&
            windowRect.width === targetRect.width &&
            windowRect.height > 0 &&
            windowRect.width > 0 &&
            (fullScreenSizeRef.current.height === 0 || windowRect.height == fullScreenSizeRef.current.height)
        ) {
            fullScreenSizeRef.current = {
                height: window.innerHeight,
                width: window.innerWidth,
            };
            setFullScreenMode(FullScreenMode.Entered);
            return;
        }

        if (
            fullScreenMode === FullScreenMode.Exitting &&
            windowSizeBeforeFullScreenRef.current.height === windowRect.height &&
            windowSizeBeforeFullScreenRef.current.width === windowRect.width &&
            windowRect.height > 0 &&
            windowRect.width > 0
        ) {
            setFullScreenMode(FullScreenMode.Exited);
        }
    }, [fullScreenMode, windowRect, targetRect]);

    React.useEffect(() => {
        addFullScreenChangeListener(handleFullScreenChange);
        return (): void => {
            removeFullScreenChangeListener(handleFullScreenChange);
        };
    }, [element]);

    return {
        enterFullScreenMode,
        exitFullScreenMode,
        fullScreenMode,
    };
};
