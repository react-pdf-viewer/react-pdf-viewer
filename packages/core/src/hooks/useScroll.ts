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

export const useScroll = ({
    elementRef,
    scrollMode,
}: {
    elementRef: React.MutableRefObject<HTMLDivElement>;
    scrollMode: ScrollMode;
}): {
    scrollOffset: number;
    scrollTo: (offset: number) => void;
} => {
    const [scrollOffset, setScrollOffset] = React.useState(0);
    const [element, setElement] = React.useState(elementRef.current);

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
                    setScrollOffset(element.scrollLeft);
                    break;
                case ScrollMode.Vertical:
                default:
                    setScrollOffset(element.scrollTop);
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
        (offset: number) => {
            const ele = elementRef.current;
            if (ele) {
                switch (scrollMode) {
                    case ScrollMode.Horizontal:
                        ele.scrollLeft = offset;
                        break;
                    case ScrollMode.Vertical:
                    default:
                        ele.scrollTop = offset;
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
