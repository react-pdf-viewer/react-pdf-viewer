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

        return (): void => {
            intersectionTracker.unobserve(container);
        };
    }, []);

    return containerRef;
};
