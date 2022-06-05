/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { ScrollMode } from '../structs/ScrollMode';
import type { Offset } from '../types/Offset';
import { easeOutQuart } from '../utils/easeOutQuart';
import { smoothScroll } from '../utils/smoothScroll';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';
import { useRafState } from './useRafState';

const ZERO_OFFSET: Offset = {
    left: 0,
    top: 0,
};

const SCROLL_EVENT_OPTIONS = {
    capture: false,
    passive: true,
};

const SCROLL_DURATION = 400;

export const useScroll = ({
    elementRef,
    isRtl,
    scrollMode,
    onSmoothScroll,
}: {
    elementRef: React.MutableRefObject<HTMLDivElement>;
    isRtl: boolean;
    scrollMode: ScrollMode;
    onSmoothScroll: (isScrollingSmoothly: boolean) => void;
}): {
    scrollOffset: Offset;
    scrollTo: (offset: Offset, withSmoothScroll: boolean) => void;
} => {
    const [scrollOffset, setScrollOffset] = useRafState(ZERO_OFFSET);
    const [element, setElement] = React.useState(elementRef.current);
    const factor = isRtl ? -1 : 1;
    const latestRef = React.useRef(scrollMode);
    latestRef.current = scrollMode;

    const handleSmoothScrollingComplete = React.useCallback(() => onSmoothScroll(false), []);

    const handleScroll = React.useCallback(() => {
        if (!element) {
            return;
        }
        switch (latestRef.current) {
            case ScrollMode.Horizontal:
                setScrollOffset({
                    left: factor * element.scrollLeft,
                    top: 0,
                });
                break;
            case ScrollMode.Vertical:
            default:
                setScrollOffset({
                    left: 0,
                    top: element.scrollTop,
                });
                break;
        }
    }, [element]);

    useIsomorphicLayoutEffect(() => {
        setElement(elementRef.current);
    });

    useIsomorphicLayoutEffect(() => {
        if (!element) {
            return;
        }
        // Handle the scroll event
        element.addEventListener('scroll', handleScroll, SCROLL_EVENT_OPTIONS);

        return () => {
            element.removeEventListener('scroll', handleScroll, SCROLL_EVENT_OPTIONS);
        };
    }, [element]);

    const scrollTo = React.useCallback(
        (targetPosition: Offset, withSmoothScroll: boolean) => {
            const ele = elementRef.current;
            if (!ele) {
                return;
            }

            let updatePosition = 0;
            let currentScrollMode = ScrollMode.Vertical;
            switch (latestRef.current) {
                case ScrollMode.Horizontal:
                    updatePosition = factor * targetPosition.left;
                    currentScrollMode = ScrollMode.Horizontal;
                    break;
                case ScrollMode.Vertical:
                default:
                    updatePosition = targetPosition.top;
                    currentScrollMode = ScrollMode.Vertical;
                    break;
            }
            if (withSmoothScroll) {
                onSmoothScroll(true);
                smoothScroll(
                    ele,
                    currentScrollMode,
                    updatePosition,
                    SCROLL_DURATION,
                    easeOutQuart,
                    handleSmoothScrollingComplete
                );
            } else {
                switch (latestRef.current) {
                    case ScrollMode.Horizontal:
                        ele.scrollLeft = updatePosition;
                        break;
                    case ScrollMode.Vertical:
                    default:
                        ele.scrollTop = updatePosition;
                        break;
                }
            }
        },
        [elementRef]
    );

    return {
        scrollOffset,
        scrollTo,
    };
};
