/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import { useMeasureRect } from './useMeasureRect';
import { useScroll } from './useScroll';
import { ScrollMode } from '../structs/ScrollMode';
import { clamp } from '../utils/clamp';
import { findNearest } from '../utils/findNearest';

interface ItemMeasurement {
    index: number;
    start: number;
    size: number;
    end: number;
    visibility: number;
}

const calculateRange = (
    measurements: ItemMeasurement[],
    outerSize: number,
    scrollOffset: number
): {
    start: number;
    end: number;
    visibilities: Record<string, number>;
} => {
    const size = measurements.length - 1;
    const getOffset = (index: number) => measurements[index].start;
    let start = findNearest(0, size, scrollOffset, getOffset);
    let end = start;

    let visibleSize = 0;
    const visibilities: Record<string, number> = {};
    let lastVisibility = 0;
    while (end < size && measurements[end].end < scrollOffset + outerSize) {
        let allVisibleSize = measurements[end].end - scrollOffset;
        lastVisibility = outerSize - allVisibleSize;
        visibilities[end] = allVisibleSize - visibleSize;
        visibleSize = allVisibleSize;
        end++;
    }
    visibilities[end] = lastVisibility;

    return {
        start,
        end,
        visibilities,
    };
};

export const useVirtual = ({
    estimateSize,
    numberOfItems,
    overscan,
    parentRef,
    scrollMode,
}: {
    estimateSize: (index: number) => number;
    numberOfItems: number;
    overscan: number;
    parentRef: React.MutableRefObject<HTMLDivElement>;
    scrollMode: ScrollMode;
}): {
    startIndex: number;
    endIndex: number;
    getContainerStyles: () => React.CSSProperties;
    getItemStyles: (item: ItemMeasurement) => React.CSSProperties;
    scrollToItem: (index: number, offset: number) => void;
    totalSize: number;
    virtualItems: ItemMeasurement[];
} => {
    const { scrollOffset, scrollTo } = useScroll({
        elementRef: parentRef,
        scrollMode,
    });
    const parentRect = useMeasureRect({
        elementRef: parentRef,
    });

    const latestRef = React.useRef({
        scrollOffset: 0,
        measurements: [] as ItemMeasurement[],
        parentSize: 0,
        totalSize: 0,
    });
    latestRef.current.scrollOffset = scrollOffset;
    switch (scrollMode) {
        case ScrollMode.Horizontal:
            latestRef.current.parentSize = parentRect.width;
            break;
        case ScrollMode.Vertical:
        default:
            latestRef.current.parentSize = parentRect.height;
            break;
    }

    const measurements = React.useMemo(() => {
        const measurements: ItemMeasurement[] = [];

        for (let i = 0; i < numberOfItems; i++) {
            const start = measurements[i - 1] ? measurements[i - 1].end : 0;
            const size = estimateSize(i);
            const end = start + size;
            measurements[i] = {
                index: i,
                start,
                size,
                end,
                visibility: -1,
            };
        }
        return measurements;
    }, [estimateSize]);

    const totalSize = measurements[numberOfItems - 1]?.end || 0;
    latestRef.current.measurements = measurements;
    latestRef.current.totalSize = totalSize;

    const { visibilities, start, end } = calculateRange(
        latestRef.current.measurements,
        latestRef.current.parentSize,
        latestRef.current.scrollOffset
    );

    const startRange = Math.max(start - overscan, 0);
    const endRange = Math.min(end + overscan, measurements.length - 1);

    const virtualItems = [];
    for (let i = startRange; i <= endRange; i++) {
        virtualItems.push({ ...measurements[i], visibility: visibilities[i] !== undefined ? visibilities[i] : -1 });
    }

    const scrollToItem = React.useCallback(
        (index: number, offset: number) => {
            const { measurements } = latestRef.current;
            const measurement = measurements[clamp(0, numberOfItems - 1, index)];
            if (measurement) {
                scrollTo(measurement.start + offset);
            }
        },
        [scrollTo]
    );

    // Build the styles for the items' container
    const getContainerStyles = React.useCallback((): React.CSSProperties => {
        switch (scrollMode) {
            case ScrollMode.Horizontal:
                return {
                    position: 'relative',
                    height: '100%',
                    width: `${totalSize}px`,
                };
            case ScrollMode.Vertical:
            default:
                return {
                    position: 'relative',
                    height: `${totalSize}px`,
                    width: '100%',
                };
        }
    }, [scrollMode, totalSize]);

    // Build the absolute position styles for each item
    const getItemStyles = React.useCallback(
        (item: ItemMeasurement): React.CSSProperties => {
            switch (scrollMode) {
                case ScrollMode.Horizontal:
                    return {
                        // Size
                        height: '100%',
                        width: `${item.size}px`,
                        // Absolute position
                        left: 0,
                        position: 'absolute',
                        top: 0,
                        transform: `translateX(${item.start}px)`,
                    };
                case ScrollMode.Vertical:
                default:
                    return {
                        // Size
                        height: `${item.size}px`,
                        width: '100%',
                        // Absolute position
                        left: 0,
                        position: 'absolute',
                        top: 0,
                        transform: `translateY(${item.start}px)`,
                    };
            }
        },
        [scrollMode]
    );

    return {
        startIndex: startRange,
        endIndex: endRange,
        getContainerStyles,
        getItemStyles,
        scrollToItem,
        totalSize,
        virtualItems,
    };
};
