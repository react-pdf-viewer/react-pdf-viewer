/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
import type { VisibilityChanged } from '../types/VisibilityChanged';

interface UseIntersectionObserverProps {
    threshold?: number | number[];
    onVisibilityChanged(params: VisibilityChanged): void;
}

export const useIntersectionObserver = (props: UseIntersectionObserverProps) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    const { threshold, onVisibilityChanged } = props;

    useIsomorphicLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }

        const intersectionTracker = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const isVisible = entry.isIntersecting;
                    const ratio = entry.intersectionRatio;
                    onVisibilityChanged({ isVisible, ratio });
                });
            },
            {
                threshold: threshold || 0,
            }
        );
        intersectionTracker.observe(container);

        // Make sure that the visibility of container is tracked when it is resized.
        // It happens when users zoom or ratate a document, for example.
        const resizeTracker = new ResizeObserver((_: ResizeObserverEntry[], __: ResizeObserver) => {
            intersectionTracker.unobserve(container);
            intersectionTracker.observe(container);
        });
        resizeTracker.observe(container);

        return (): void => {
            intersectionTracker.unobserve(container);
            resizeTracker.unobserve(container);
        };
    }, []);

    return containerRef;
};
