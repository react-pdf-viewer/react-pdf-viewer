/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';
import { ScrollMode } from '../structs/ScrollMode';
import type { Offset } from '../types/Offset';

const ZERO_OFFSET: Offset = {
    left: 0,
    top: 0,
};

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
    const [scrollOffset, setScrollOffset] = React.useState(ZERO_OFFSET);
    const [element, setElement] = React.useState(elementRef.current);
    const factor = isRtl ? -1 : 1;

    useIsomorphicLayoutEffect(() => {
        setElement(elementRef.current);
    });

    useIsomorphicLayoutEffect(() => {
        if (!element) {
            return;
        }

        const handleScroll = () => {
            switch (scrollMode) {
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
        element.addEventListener('scroll', handleScroll, { capture: false, passive: true });

        return () => {
            element.removeEventListener('scroll', handleScroll);
        };
    }, [element, scrollMode]);

    const scrollTo = React.useCallback(
        (offset: Offset) => {
            const ele = elementRef.current;
            if (ele) {
                switch (scrollMode) {
                    case ScrollMode.Horizontal:
                        ele.scrollLeft = factor * offset.left;
                        break;
                    case ScrollMode.Vertical:
                    default:
                        ele.scrollTop = offset.top;
                        break;
                }
            }
        },
        [elementRef, scrollMode]
    );

    return {
        scrollOffset,
        scrollTo,
    };
};
