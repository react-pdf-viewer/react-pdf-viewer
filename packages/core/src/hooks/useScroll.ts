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
}: {
    elementRef: React.MutableRefObject<HTMLDivElement>;
    isRtl: boolean;
    scrollMode: ScrollMode;
}): {
    scrollOffset: Offset;
    scrollTo: (offset: Offset) => void;
} => {
    const [scrollOffset, setScrollOffset] = useRafState(ZERO_OFFSET);
    const [element, setElement] = React.useState(elementRef.current);
    const factor = isRtl ? -1 : 1;
    const latestRef = React.useRef(scrollMode);
    latestRef.current = scrollMode;

    useIsomorphicLayoutEffect(() => {
        setElement(elementRef.current);
    });

    useIsomorphicLayoutEffect(() => {
        if (!element) {
            return;
        }
        const handleScroll = () => {
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
        };

        // Handle the scroll event
        element.addEventListener('scroll', handleScroll, SCROLL_EVENT_OPTIONS);

        return () => {
            element.removeEventListener('scroll', handleScroll, SCROLL_EVENT_OPTIONS);
        };
    }, [element]);

    const scrollTo = React.useCallback(
        (targetPosition: Offset) => {
            const ele = elementRef.current;
            if (ele) {
                switch (latestRef.current) {
                    case ScrollMode.Horizontal:
                        smoothScroll(
                            ele,
                            ScrollMode.Horizontal,
                            factor * targetPosition.left,
                            SCROLL_DURATION,
                            easeOutQuart
                        );
                        break;
                    case ScrollMode.Vertical:
                    default:
                        smoothScroll(ele, ScrollMode.Vertical, targetPosition.top, SCROLL_DURATION, easeOutQuart);
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
