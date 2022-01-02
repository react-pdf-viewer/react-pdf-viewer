/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

export const useScroll = ({
    elementRef,
}: {
    elementRef: React.MutableRefObject<HTMLDivElement>;
}): {
    scrollOffset: number;
    scrollTo: (topOffset: number) => void;
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
            setScrollOffset(element.scrollTop);
        };

        // Handle the scroll event
        element.addEventListener('scroll', handleScroll, { capture: false, passive: true });

        return () => {
            element.removeEventListener('scroll', handleScroll);
        };
    }, [element]);

    const scrollTo = React.useCallback(
        (topOffset: number) => {
            if (elementRef.current) {
                elementRef.current.scrollTop = topOffset;
            }
        },
        [elementRef]
    );

    return {
        scrollOffset,
        scrollTo,
    };
};
