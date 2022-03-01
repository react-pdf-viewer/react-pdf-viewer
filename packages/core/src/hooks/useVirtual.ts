/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';
import { useMeasureRect } from './useMeasureRect';
import { useScroll } from './useScroll';
import { ScrollMode } from '../structs/ScrollMode';
import { clamp } from '../utils/clamp';
import { findNearest } from '../utils/findNearest';
import type { Offset } from '../types/Offset';
import type { Rect } from '../types/Rect';

interface ItemMeasurement {
    index: number;
    start: Offset;
    size: Rect;
    end: Offset;
    visibility: number;
}
interface VirtualItem extends ItemMeasurement {
    measureRef: (ele: HTMLElement) => void;
}

const ZERO_RECT: Rect = {
    height: 0,
    width: 0,
};
const ZERO_OFFSET: Offset = {
    left: 0,
    top: 0,
};

const calculateRange = (
    scrollMode: ScrollMode,
    measurements: ItemMeasurement[],
    outerSize: Rect,
    scrollOffset: Offset
): {
    start: number;
    end: number;
    maxVisbilityIndex: number;
    visibilities: Record<string, number>;
} => {
    let currentOffset = 0;

    switch (scrollMode) {
        case ScrollMode.Horizontal:
            currentOffset = scrollOffset.left;
            break;
        case ScrollMode.Vertical:
        default:
            currentOffset = scrollOffset.top;
            break;
    }

    const size = measurements.length - 1;
    const getOffset = (index: number) => {
        switch (scrollMode) {
            case ScrollMode.Horizontal:
                return measurements[index].start.left;
            case ScrollMode.Wrapped:
            case ScrollMode.Vertical:
            default:
                return measurements[index].start.top;
        }
    };

    let start = findNearest(0, size, currentOffset, getOffset);
    if (scrollMode === ScrollMode.Wrapped) {
        // Find the first item in the same row which has the same `top` value
        // and the `left` value is greater than `scrollOffset.left`
        const startTop = measurements[start].start.top;
        while (
            start - 1 >= 0 &&
            measurements[start - 1].start.top === startTop &&
            measurements[start - 1].start.left >= scrollOffset.left
        ) {
            start--;
        }
    }

    let end = start;
    // The visiblities of each item
    const visibilities: Record<string, number> = {};
    let maxVisbilityIndex = start;
    let maxVisbility = -1;
    while (end <= size) {
        const itemRect = measurements[end].size;
        const visibility = {
            width: 0,
            height: 0,
        };
        const topLeftCorner = {
            top: measurements[end].start.top - scrollOffset.top,
            left: measurements[end].start.left - scrollOffset.left,
        };
        const visibleSize = {
            height: outerSize.height - topLeftCorner.top,
            width: outerSize.width - topLeftCorner.left,
        };

        //          |                        |
        //    (8)   |           (1)          |   (2)
        //          |                        |
        // ─ ─ ─ ─ ─┼────────────────────────┼─ ─ ─ ─ ─
        //          |                        |
        //          |                        |
        //    (7)   |      Container         |   (3)
        //          |                        |
        //          |                        |
        //          |                        |
        // ─ ─ ─ ─ ─┼────────────────────────┼─ ─ ─ ─ ─
        //          |                        |
        //    (6)   |           (5)          |   (4)
        //          |                        |
        if (scrollMode === ScrollMode.Horizontal && visibleSize.width < 0) {
            // The top left corner belongs to the (2, 3, 4) areas
            end--;
            break;
        }
        if (scrollMode === ScrollMode.Vertical && visibleSize.height < 0) {
            // The top left corner belongs to the (4, 5) areas
            end--;
            break;
        }
        if (scrollMode === ScrollMode.Wrapped && (visibleSize.width < 0 || visibleSize.height < 0)) {
            // The top left corner belongs to the (2, 3, 4, 5) areas
            end--;
            break;
        }

        // Calculate the width that is visible within the container
        // We don't care it in the vertical scroll mode
        if (scrollMode === ScrollMode.Vertical) {
            visibility.width = 1;
        } else if (topLeftCorner.left < 0) {
            // The top left corner belongs to the (1) area
            // 1) The top right corner is inside of the container
            // |   (top, left)          |
            // |        ●─ ─ ─ ─ ─●     |   visibility.width = 1
            // |           (top, right) |
            // |                        |
            // ┌────────────────────────┐
            // |                        |
            // |                        |
            // |                        |
            // |                        |
            // |                        |
            // └────────────────────────┘

            // 2) The top right corner is outside of the container
            // |   (top, left)          |       (top, right)
            // |        ●─ ─ ─ ─ ─ ─ ─ ─┼─ ─ ─ ─ ─ ─●
            // |                        |
            // ┌────────────────────────┐
            // |                        |
            // |                        |
            // |                        |
            // |                        |
            // |                        |
            // └────────────────────────┘
            const visibleWidth = itemRect.width - -topLeftCorner.left;
            visibility.width = visibleWidth <= outerSize.width ? visibleWidth / outerSize.width : 1;
        } else {
            // The top left corner is inside of the container
            // 1) The top right corner is inside of the container
            // ┌────────────────────────┐
            // |   (top, left)          |
            // |        ●─ ─ ─ ─ ─●     |   visibility.width = 1
            // |           (top, right) |
            // |                        |
            // |                        |
            // └────────────────────────┘

            // 2) The top right corner is outside of the container
            // ┌────────────────────────┐
            // |   (top, left)          |       (top, right)
            // |        ●─ ─ ─ ─ ─ ─ ─ ─┼─ ─ ─ ─ ─ ─●
            // |                        |
            // |                        |   visibility.width = visibleSize.width / itemRect.width;
            // |                        |
            // └────────────────────────┘
            visibility.width = itemRect.width <= visibleSize.width ? 1 : visibleSize.width / itemRect.width;
        }

        // Calculate the height that is visible within the container
        // There are four cases
        if (scrollMode === ScrollMode.Horizontal) {
            visibility.height = 1;
        } else if (topLeftCorner.top < 0) {
            // The top left corner belongs to the (1) area
            // 1) The bottom left corner is inside of the container
            // |   (top, left)          |
            // |        ●               |
            // |        |               |
            // ┌────────┼───────────────┐   visibility.height = visibleHeight / outerSize.height;
            // |        |               |
            // |        |               |
            // |        ● (bottom, left)|
            // |                        |
            // └────────────────────────┘

            // 2) The bottom left corner is outside of the container
            // |   (top, left)          |
            // |        ●               |
            // |        |               |
            // ┌────────┼───────────────┐
            // |        |               |   visibility.height = 1;
            // |        |               |
            // |        |               |
            // |        |               |
            // └────────┼───────────────┘
            // |        |               |
            // |        ● (bottom, left)|
            const visibleHeight = itemRect.height - -topLeftCorner.top;
            visibility.height = visibleHeight <= outerSize.height ? visibleHeight / outerSize.height : 1;
        } else {
            // The top left corner is inside of the container
            // 1) The bottom left corner is inside of the container
            // ┌────────────────────────┐
            // |   (top, left)          |
            // |        ●               |
            // |        |               |   visibility.height = 1;
            // |        |               |
            // |        ● (bottom, left)|
            // └────────────────────────┘

            // 2) The bottom left corner is outside of the container
            // ┌────────────────────────┐
            // |   (top, left)          |
            // |        ●               |
            // |        |               |   visibility.height = visibleSize.height / itemRect.height;
            // |        |               |
            // |        |               |
            // └────────┼───────────────┘
            //          |
            //          ● (bottom, left)
            visibility.height = itemRect.height <= visibleSize.height ? 1 : visibleSize.height / itemRect.height;
        }

        visibilities[end] = visibility.width * visibility.height;
        if (maxVisbility < visibilities[end]) {
            maxVisbility = visibilities[end];
            maxVisbilityIndex = end;
        }
        end++;
    }

    return {
        start,
        end,
        maxVisbilityIndex,
        visibilities,
    };
};

export const useVirtual = ({
    estimateSize,
    isRtl,
    numberOfItems,
    setStartRange,
    setEndRange,
    parentRef,
    scrollMode,
    transformSize,
}: {
    estimateSize: (index: number) => Rect;
    isRtl: boolean;
    numberOfItems: number;
    setStartRange(startIndex: number): number;
    setEndRange(endIndex: number): number;
    parentRef: React.MutableRefObject<HTMLDivElement>;
    scrollMode: ScrollMode;
    // Modify the size of each item. For example, items might have paddings
    transformSize: (size: Rect) => Rect;
}): {
    startIndex: number;
    startRange: number;
    endIndex: number;
    endRange: number;
    maxVisbilityIndex: number;
    getContainerStyles: () => React.CSSProperties;
    getItemStyles: (item: VirtualItem) => React.CSSProperties;
    scrollToItem: (index: number, offset: Offset) => void;
    virtualItems: VirtualItem[];
} => {
    const { scrollOffset, scrollTo } = useScroll({
        elementRef: parentRef,
        isRtl,
        scrollMode,
    });
    const parentRect = useMeasureRect({
        elementRef: parentRef,
    });

    const latestRef = React.useRef({
        scrollOffset: ZERO_OFFSET,
        measurements: [] as ItemMeasurement[],
        parentRect: ZERO_RECT,
        totalSize: ZERO_RECT,
    });
    latestRef.current.scrollOffset = scrollOffset;
    latestRef.current.parentRect = parentRect;

    // Support dynamic size of each item
    const [cacheMeasure, setCacheMeasure] = React.useState<Record<number, Rect>>({});

    const measurements = React.useMemo(() => {
        const measurements: ItemMeasurement[] = [];

        let totalWidth = 0;
        let firstOfRow = {
            left: 0,
            top: 0,
        };
        // Maximum height of items which are in the same row (in the wrapped layout mode)
        // The value will be used to calculate the `start` position for items in the next row
        let maxHeight = 0;
        for (let i = 0; i < numberOfItems; i++) {
            const size = cacheMeasure[i] || transformSize(estimateSize(i));
            let start = ZERO_OFFSET;
            if (i === 0) {
                totalWidth = size.width;
                firstOfRow = {
                    left: 0,
                    top: 0,
                };
                maxHeight = size.height;
            } else {
                switch (scrollMode) {
                    case ScrollMode.Wrapped:
                        // Check if the total width exceeds the parent's width
                        totalWidth += size.width;
                        if (totalWidth < parentRect.width) {
                            start = {
                                left: measurements[i - 1].end.left,
                                top: firstOfRow.top,
                            };
                            maxHeight = Math.max(maxHeight, size.height);
                        } else {
                            // Put the item in the next row
                            totalWidth = size.width;
                            start = {
                                left: firstOfRow.left,
                                top: firstOfRow.top + maxHeight,
                            };
                            firstOfRow = {
                                left: start.left,
                                top: start.top,
                            };
                            maxHeight = size.height;
                        }
                        break;
                    case ScrollMode.Horizontal:
                    case ScrollMode.Vertical:
                    default:
                        // Starts from the ending point of the previous item
                        start = measurements[i - 1].end;
                        break;
                }
            }

            const end = {
                left: start.left + size.width,
                top: start.top + size.height,
            };

            measurements[i] = {
                index: i,
                start,
                size,
                end,
                visibility: -1,
            };
        }
        return measurements;
    }, [estimateSize, scrollMode, parentRect, cacheMeasure, transformSize]);

    const totalSize = measurements[numberOfItems - 1]
        ? {
              height: measurements[numberOfItems - 1].end.top,
              width: measurements[numberOfItems - 1].end.left,
          }
        : ZERO_RECT;
    latestRef.current.measurements = measurements;
    latestRef.current.totalSize = totalSize;

    const { maxVisbilityIndex, visibilities, start, end } = calculateRange(
        scrollMode,
        latestRef.current.measurements,
        latestRef.current.parentRect,
        latestRef.current.scrollOffset
    );

    const startRange = setStartRange(start);
    const endRange = setEndRange(end);

    const virtualItems = React.useMemo(() => {
        const virtualItems: VirtualItem[] = [];

        for (let i = startRange; i <= endRange; i++) {
            const item = measurements[i];
            const virtualItem: VirtualItem = {
                ...item,
                visibility: visibilities[i] !== undefined ? visibilities[i] : -1,
                measureRef: (ele) => {
                    if (!ele) {
                        return;
                    }
                    const rect = ele.getBoundingClientRect();
                    const measuredSize = transformSize({
                        height: rect.height,
                        width: rect.width,
                    });
                    if (measuredSize.height !== item.size.height || measuredSize.width !== item.size.width) {
                        setCacheMeasure((old) => ({
                            ...old,
                            [i]: measuredSize,
                        }));
                    }
                },
            };
            virtualItems.push(virtualItem);
        }

        return virtualItems;
    }, [transformSize, visibilities, measurements]);

    const scrollToItem = React.useCallback(
        (index: number, offset: Offset) => {
            const { measurements } = latestRef.current;
            const measurement = measurements[clamp(0, numberOfItems - 1, index)];
            if (measurement) {
                scrollTo({
                    left: offset.left + measurement.start.left,
                    top: offset.top + measurement.start.top,
                });
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
                    width: `${totalSize.width}px`,
                };
            case ScrollMode.Vertical:
            default:
                return {
                    position: 'relative',
                    height: `${totalSize.height}px`,
                    width: '100%',
                };
        }
    }, [scrollMode, totalSize]);

    // Build the absolute position styles for each item
    const getItemStyles = React.useCallback(
        (item: VirtualItem): React.CSSProperties => {
            const sideProperty = isRtl ? 'right' : 'left';
            const factor = isRtl ? -1 : 1;
            switch (scrollMode) {
                case ScrollMode.Horizontal:
                    return {
                        // Size
                        height: '100%',
                        width: `${item.size.width}px`,
                        // Absolute position
                        [sideProperty]: 0,
                        position: 'absolute',
                        top: 0,
                        transform: `translateX(${item.start.left * factor}px)`,
                    };
                case ScrollMode.Wrapped:
                    return {
                        // Size
                        height: `${item.size.height}px`,
                        width: `${item.size.width}px`,
                        // Absolute position
                        [sideProperty]: 0,
                        position: 'absolute',
                        top: 0,
                        transform: `translate(${item.start.left * factor}px, ${item.start.top}px)`,
                    };
                case ScrollMode.Vertical:
                default:
                    return {
                        // Size
                        height: `${item.size.height}px`,
                        width: '100%',
                        // Absolute position
                        [sideProperty]: 0,
                        position: 'absolute',
                        top: 0,
                        transform: `translateY(${item.start.top}px)`,
                    };
            }
        },
        [isRtl, scrollMode]
    );

    return {
        startIndex: start,
        startRange,
        endIndex: end,
        endRange,
        maxVisbilityIndex,
        getContainerStyles,
        getItemStyles,
        scrollToItem,
        virtualItems,
    };
};
