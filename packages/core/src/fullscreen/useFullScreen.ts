/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
import { useWindowResize } from '../hooks/useWindowResize';
import { FullScreenMode } from '../structs/FullScreenMode';
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

const EPSILON = 2;

const equal = (a: number, b: number) => Math.abs(a - b) <= EPSILON;

export const useFullScreen = ({ targetRef }: { targetRef: React.RefObject<HTMLElement> }) => {
    const [fullScreenMode, setFullScreenMode] = React.useState(FullScreenMode.Normal);
    const windowRect = useWindowResize();
    const [targetRect, setTargetRect] = React.useState<Rect>(ZERO_RECT);
    const windowSizeBeforeFullScreenRef = React.useRef<Rect>(ZERO_RECT);

    const fullScreenSizeRef = React.useRef<Rect>(ZERO_RECT);
    const [element, setElement] = React.useState<HTMLElement | null>(targetRef.current);

    const fullScreenElementRef = React.useRef<HTMLElement | null>(null);

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
                // Always use `clientHeight` instead of the bounding rect (`getBoundingClientRect().height`) because they aren't the same
                // Causing the comparison with the `window.innerHeight` doesn't work properly
                setTargetRect({
                    height: entry.target.clientHeight,
                    width: entry.target.clientWidth,
                });
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
                    fullScreenElementRef.current.style.backgroundColor = 'hsl(var(--rpv-background))';
                }
                // Store the latest window size right after entering the full screen mode
                windowSizeBeforeFullScreenRef.current = {
                    height: window.innerHeight,
                    width: window.innerWidth,
                };
                break;

            // Entering the full screen mode completes
            case FullScreenMode.Entered:
                break;

            case FullScreenMode.Exitting:
                if (fullScreenElementRef.current) {
                    fullScreenElementRef.current.style.backgroundColor = '';
                    fullScreenElementRef.current = null;
                }
                break;

            // Exitting the full screen mode completes
            case FullScreenMode.Exited:
                setFullScreenMode(FullScreenMode.Normal);
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
            equal(windowRect.height, targetRect.height) &&
            equal(windowRect.width, targetRect.width) &&
            windowRect.height > 0 &&
            windowRect.width > 0 &&
            (fullScreenSizeRef.current.height === 0 || equal(windowRect.height, fullScreenSizeRef.current.height))
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
            equal(windowSizeBeforeFullScreenRef.current.height, windowRect.height) &&
            equal(windowSizeBeforeFullScreenRef.current.width, windowRect.width) &&
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
