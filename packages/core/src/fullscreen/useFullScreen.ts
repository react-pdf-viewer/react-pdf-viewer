/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { useTrackResize } from '../hooks/useTrackResize';
import { useWindowResize } from '../hooks/useWindowResize';
import { FullScreenMode } from '../structs/FullScreenMode';
import { ScrollMode } from '../structs/ScrollMode';
import type { Rect } from '../types/Rect';
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
    jumpToPage: (pageIndex: number) => void;
    targetRef: React.MutableRefObject<HTMLDivElement>;
}) => {
    const [fullScreenMode, setFullScreenMode] = React.useState(FullScreenMode.Normal);
    const windowRect = useWindowResize();
    const [targetRect, setTargetRect] = React.useState<Rect>(ZERO_RECT);
    const windowSizeBeforeFullScreenRef = React.useRef<Rect>(ZERO_RECT);
    const targetPageRef = React.useRef(getCurrentPage());

    const fullScreenSizeRef = React.useRef<Rect>(ZERO_RECT);

    const handleResize = React.useCallback((target: Element) => {
        const { height, width } = target.getBoundingClientRect();
        setTargetRect({ height, width });
    }, []);

    useTrackResize({
        targetRef,
        onResize: handleResize,
    });

    const closeOtherFullScreen = () => {
        const element = targetRef.current;
        if (!element) {
            return;
        }

        const currentFullScreenEle = getFullScreenElement();
        if (currentFullScreenEle && currentFullScreenEle !== element) {
            setFullScreenMode(FullScreenMode.Normal);
            return exitFullScreen(currentFullScreenEle);
        }

        return Promise.resolve();
    };

    const enterFullScreenMode = React.useCallback(() => {
        const element = targetRef.current;
        if (!element || !isFullScreenEnabled()) {
            return;
        }
        closeOtherFullScreen().then(() => {
            setFullScreenMode(FullScreenMode.Entering);
            requestFullScreen(element);
        });
    }, []);

    const exitFullScreenMode = React.useCallback(() => {
        const element = targetRef.current;
        if (!element) {
            return;
        }

        const currentFullScreenEle = getFullScreenElement();
        if (currentFullScreenEle && currentFullScreenEle === element) {
            setFullScreenMode(FullScreenMode.Exitting);
            exitFullScreen(document);
        }
    }, []);

    const handleFullScreenChange = React.useCallback(() => {
        const element = targetRef.current;
        if (!element) {
            return;
        }
        const currentFullScreenEle = getFullScreenElement();
        if (currentFullScreenEle !== element) {
            setFullScreenMode(FullScreenMode.Exitting);
        }
    }, []);

    React.useEffect(() => {
        switch (fullScreenMode) {
            case FullScreenMode.Entering:
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
                    jumpToPage(targetPageRef.current);
                }
                break;

            case FullScreenMode.Exitting:
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
    }, []);

    return {
        enterFullScreenMode,
        exitFullScreenMode,
        fullScreenMode,
    };
};
