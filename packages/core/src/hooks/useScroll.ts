/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { ScrollDirection } from '../structs/ScrollDirection';
import { type Offset } from '../types/Offset';
import { easeOutQuart } from '../utils/easeOutQuart';
import { smoothScroll } from '../utils/smoothScroll';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

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
    enableSmoothScroll,
    isRtl,
    scrollDirection,
    onSmoothScroll,
}: {
    elementRef: React.MutableRefObject<HTMLDivElement>;
    enableSmoothScroll: boolean;
    isRtl: boolean;
    scrollDirection: ScrollDirection;
    onSmoothScroll: (isScrollingSmoothly: boolean) => void;
}): {
    scrollOffset: Offset;
    scrollTo: (offset: Offset, withSmoothScroll: boolean) => Promise<void>;
} => {
    const [scrollOffset, setScrollOffset] = React.useState(ZERO_OFFSET);
    const [element, setElement] = React.useState(elementRef.current);
    const factor = isRtl ? -1 : 1;
    const latestRef = React.useRef(scrollDirection);
    latestRef.current = scrollDirection;

    const latestOffsetRef = React.useRef(ZERO_OFFSET);
    const isSmoothScrollingDoneRef = React.useRef(true);

    const handleSmoothScrollingComplete = React.useCallback(() => {
        isSmoothScrollingDoneRef.current = true;
        if (enableSmoothScroll) {
            setScrollOffset(latestOffsetRef.current);
        }
        onSmoothScroll(false);
    }, []);

    const handleScroll = React.useCallback(() => {
        if (!element) {
            return;
        }
        switch (latestRef.current) {
            case ScrollDirection.Horizontal:
                latestOffsetRef.current = {
                    left: factor * element.scrollLeft,
                    top: 0,
                };
                break;
            case ScrollDirection.Both:
                latestOffsetRef.current = {
                    left: factor * element.scrollLeft,
                    top: element.scrollTop,
                };
                break;
            case ScrollDirection.Vertical:
            default:
                latestOffsetRef.current = {
                    left: 0,
                    top: element.scrollTop,
                };
                break;
        }
        if (!enableSmoothScroll || isSmoothScrollingDoneRef.current) {
            setScrollOffset(latestOffsetRef.current);
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
                return Promise.resolve();
            }

            let updatePosition = {
                left: 0,
                top: 0,
            };
            switch (latestRef.current) {
                case ScrollDirection.Horizontal:
                    updatePosition.left = factor * targetPosition.left;
                    break;
                case ScrollDirection.Both:
                    updatePosition.left = factor * targetPosition.left;
                    updatePosition.top = targetPosition.top;
                    break;
                case ScrollDirection.Vertical:
                default:
                    updatePosition.top = targetPosition.top;
                    break;
            }
            if (withSmoothScroll) {
                isSmoothScrollingDoneRef.current = false;
                onSmoothScroll(true);
                return new Promise<void>((resolve, _) => {
                    smoothScroll(ele, latestRef.current, updatePosition, SCROLL_DURATION, easeOutQuart, () => {
                        handleSmoothScrollingComplete();
                        resolve();
                    });
                });
            }

            return new Promise<void>((resolve, _) => {
                switch (latestRef.current) {
                    case ScrollDirection.Horizontal:
                        ele.scrollLeft = updatePosition.left;
                        break;
                    case ScrollDirection.Both:
                        ele.scrollLeft = updatePosition.left;
                        ele.scrollTop = updatePosition.top;
                        break;
                    case ScrollDirection.Vertical:
                    default:
                        ele.scrollTop = updatePosition.top;
                        break;
                }
                resolve();
            });
        },
        [elementRef],
    );

    return {
        scrollOffset,
        scrollTo,
    };
};
