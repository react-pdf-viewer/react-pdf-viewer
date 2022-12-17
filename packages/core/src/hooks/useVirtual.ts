/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { ScrollDirection } from '../structs/ScrollDirection';
import { ScrollMode } from '../structs/ScrollMode';
import { SpreadsMode } from '../structs/SpreadsMode';
import type { Offset } from '../types/Offset';
import type { Rect } from '../types/Rect';
import { clamp } from '../utils/clamp';
import { findNearest } from '../utils/findNearest';
import { useMeasureRect } from './useMeasureRect';
import { useScroll } from './useScroll';

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
    scrollDirection: ScrollDirection,
    measurements: ItemMeasurement[],
    outerSize: Rect,
    scrollOffset: Offset
): {
    start: number;
    end: number;
    maxVisbilityItem: number;
    visibilities: Record<string, number>;
} => {
    let currentOffset = 0;

    switch (scrollDirection) {
        case ScrollDirection.Horizontal:
            currentOffset = scrollOffset.left;
            break;
        case ScrollDirection.Vertical:
        default:
            currentOffset = scrollOffset.top;
            break;
    }

    const size = measurements.length - 1;
    const getOffset = (index: number) => {
        switch (scrollDirection) {
            case ScrollDirection.Horizontal:
                return measurements[index].start.left;
            case ScrollDirection.Both:
            case ScrollDirection.Vertical:
            default:
                return measurements[index].start.top;
        }
    };

    let start = findNearest(0, size, currentOffset, getOffset);
    if (scrollDirection === ScrollDirection.Both) {
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
    let maxVisbilityItem = start;
    let maxVisbility = -1;
    while (end <= size) {
        const itemRect = measurements[end].size;
        const visibility = ZERO_RECT;
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
        if (scrollDirection === ScrollDirection.Horizontal && visibleSize.width < 0) {
            // The top left corner belongs to the (2, 3, 4) areas
            end--;
            break;
        }
        if (scrollDirection === ScrollDirection.Vertical && visibleSize.height < 0) {
            // The top left corner belongs to the (4, 5) areas
            end--;
            break;
        }
        if (scrollDirection === ScrollDirection.Both && (visibleSize.width < 0 || visibleSize.height < 0)) {
            // The top left corner belongs to the (2, 3, 4, 5) areas
            end--;
            break;
        }

        // Calculate the width that is visible within the container
        // We don't care it in the vertical scroll mode
        if (scrollDirection === ScrollDirection.Vertical) {
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
        if (scrollDirection === ScrollDirection.Horizontal) {
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
            maxVisbilityItem = end;
        }
        end++;
    }

    return {
        start,
        end,
        maxVisbilityItem,
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
    spreadsMode,
    transformSize,
}: {
    estimateSize: (index: number) => Rect;
    isRtl: boolean;
    numberOfItems: number;
    setStartRange(startIndex: number): number;
    setEndRange(endIndex: number): number;
    parentRef: React.MutableRefObject<HTMLDivElement>;
    scrollMode: ScrollMode;
    spreadsMode: SpreadsMode;
    // Modify the size of each item. For example, items might have paddings
    transformSize: (index: number, size: Rect) => Rect;
}): {
    isSmoothScrolling: boolean;
    startIndex: number;
    startRange: number;
    endIndex: number;
    endRange: number;
    maxVisbilityIndex: number;
    virtualItems: VirtualItem[];
    getContainerStyles: () => React.CSSProperties;
    getItemContainerStyles: (item: VirtualItem) => React.CSSProperties;
    getItemStyles: (item: VirtualItem) => React.CSSProperties;
    scrollToItem: (index: number, offset: Offset) => void;
    scrollToNextItem: (index: number, offset: Offset) => void;
    scrollToPreviousItem: (index: number, offset: Offset) => void;
    zoom: (scale: number) => void;
} => {
    const [isSmoothScrolling, setSmoothScrolling] = React.useState(false);
    const onSmoothScroll = React.useCallback((isSmoothScrolling: boolean) => setSmoothScrolling(isSmoothScrolling), []);

    const scrollModeRef = React.useRef(scrollMode);
    scrollModeRef.current = scrollMode;

    const scrollDirection = scrollMode === ScrollMode.Wrapped || spreadsMode === SpreadsMode.OddSpreads
                ? ScrollDirection.Both
                : scrollMode === ScrollMode.Horizontal
                ? ScrollDirection.Horizontal
                : ScrollDirection.Vertical;

    const { scrollOffset, scrollTo } = useScroll({
        elementRef: parentRef,
        isRtl,
        scrollDirection,
        onSmoothScroll,
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

        // Single page scrolling mode
        if (scrollMode === ScrollMode.Page) {
            for (let i = 0; i < numberOfItems; i++) {
                const transformedSize = cacheMeasure[i] || transformSize(i, estimateSize(i));
                const size = {
                    height: Math.max(parentRect.height, transformedSize.height),
                    width: Math.max(parentRect.width, transformedSize.width),
                };
                const start: Offset = (i === 0)
                     ? ZERO_OFFSET
                     : measurements[i - 1].end;
                const end: Offset = {
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
        }

        // `OddSpreads` mode
        if (spreadsMode === SpreadsMode.OddSpreads) {
            for (let i = 0; i < numberOfItems; i++) {
                const transformedSize = cacheMeasure[i] || transformSize(i, estimateSize(i));
                const size = {
                    height: Math.max(parentRect.height, transformedSize.height),
                    width: Math.max(parentRect.width / 2, transformedSize.width),
                };
                const start: Offset = {
                    left: i % 2 === 0 ? 0 : size.width,
                    top: Math.floor(i / 2) * size.height,
                };
                const end: Offset = {
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
        }

        // `NoSpreads` mode
        let totalWidth = 0;
        let firstOfRow = {
            left: 0,
            top: 0,
        };
        // Maximum height of items which are in the same row (in the wrapped layout mode)
        // The value will be used to calculate the `start` position for items in the next row
        let maxHeight = 0;
        for (let i = 0; i < numberOfItems; i++) {
            const size = cacheMeasure[i] || transformSize(i, estimateSize(i));
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

    const { maxVisbilityItem, visibilities, start, end } = calculateRange(
        scrollDirection,
        latestRef.current.measurements,
        latestRef.current.parentRect,
        latestRef.current.scrollOffset
    );

    // Determine the page that has max visbility
    let maxVisbilityIndex = maxVisbilityItem;
    switch (spreadsMode) {
        case SpreadsMode.EvenSpreads:
            break;
        case SpreadsMode.OddSpreads:
            maxVisbilityIndex = maxVisbilityItem % 2 === 0 ? maxVisbilityItem : maxVisbilityItem - 1;
            break;
        case SpreadsMode.NoSpreads:
        default:
            maxVisbilityIndex = maxVisbilityItem;
            break;
    }

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
                    if (rect.height === 0 && rect.width === 0) {
                        // This happens in the unit test environment
                        return;
                    }
                    const measuredSize = transformSize(i, {
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
            const normalizedIndex = clamp(0, numberOfItems - 1, index);
            const measurement = measurements[normalizedIndex];
            // Ignore the offset in the single page scrolling mode
            const withOffset = (scrollModeRef.current === ScrollMode.Page) ? ZERO_OFFSET : offset;
            if (measurement) {
                scrollTo(
                    {
                        left: withOffset.left + measurement.start.left,
                        top: withOffset.top + measurement.start.top,
                    },
                    true
                );
            }
        },
        [scrollTo]
    );

    const scrollToSmallestItemAbove = React.useCallback((index: number, offset: Offset) => {
        const { measurements } = latestRef.current;
        const start = measurements[index].start;
        // Find the smallest item whose `top` is bigger than the current item
        const nextItem = measurements.find((item) => item.start.top > start.top);
        if (nextItem) {
            scrollToItem(nextItem.index, offset);
        }
    }, []);

    const scrollToSmallestItemBelow = React.useCallback((index: number, offset: Offset) => {
        const { measurements } = latestRef.current;
        const start = measurements[index].start;
        // Find the smallest item whose `top` is smaller than the current item
        // Because `findLast` isn't available for ES5 target
        for (let i = numberOfItems - 1; i >= 0; i--) {
            if (measurements[i].start.top < start.top) {
                scrollToItem(measurements[i].index, offset);
                break;
            }
        }
    }, []);

    const scrollToNextItem = React.useCallback((index: number, offset: Offset) => {
        // `OddSpreads` mode
        if (spreadsMode === SpreadsMode.OddSpreads) {
            scrollToSmallestItemAbove(index, offset);
            return;
        }

        // `NoSpreads` mode
        switch (scrollModeRef.current) {
            case ScrollMode.Wrapped:
                scrollToSmallestItemAbove(index, offset);
                break;
            case ScrollMode.Horizontal:
            case ScrollMode.Vertical:
            default:
                scrollToItem(index + 1, offset);
                break;
        }
    }, []);

    const scrollToPreviousItem = React.useCallback((index: number, offset: Offset) => {
        // `OddSpreads` mode
        if (spreadsMode === SpreadsMode.OddSpreads) {
            scrollToSmallestItemBelow(index, offset);
            return;
        }

        // `NoSpreads` mode
        switch (scrollModeRef.current) {
            case ScrollMode.Wrapped:
                scrollToSmallestItemBelow(index, offset);
                break;
            case ScrollMode.Horizontal:
            case ScrollMode.Vertical:
            default:
                scrollToItem(index - 1, offset);
                break;
        }
    }, []);

    // Build the styles for the items' container
    const getContainerStyles = React.useCallback((): React.CSSProperties => {
        switch (scrollModeRef.current) {
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
    }, [totalSize]);

    const getItemContainerStyles = React.useCallback(
        (item: VirtualItem): React.CSSProperties => {
            return (scrollModeRef.current !== ScrollMode.Page)
                ? {}
                : {
                    // Size
                    height: `${parentRect.height}px`,
                    width: '100%',
                    // Absolute position
                    position: 'absolute',
                    top: 0,
                    transform: `translateY(${item.start.top}px)`,
                };
        },
        [parentRect]
    );

    // Build the absolute position styles for each item
    const getItemStyles = React.useCallback(
        (item: VirtualItem): React.CSSProperties => {
            const sideProperty = isRtl ? 'right' : 'left';
            const factor = isRtl ? -1 : 1;

            if (spreadsMode === SpreadsMode.OddSpreads) {
                return {
                    // Size
                    height: `${item.size.height}px`,
                    width: `${item.size.width}px`,
                    // Absolute position
                    [sideProperty]: 0,
                    position: 'absolute',
                    top: 0,
                    transform: `translate(${item.start.left}px, ${item.start.top}px)`,
                };
            }

            switch (scrollModeRef.current) {
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
                case ScrollMode.Page:
                    return {
                        // Size
                        height: '100%',
                        width: `${item.size.width}px`,
                        // Absolute position
                        [sideProperty]: 0,
                        position: 'absolute',
                        top: 0,
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
        [isRtl]
    );

    const zoom = React.useCallback((scale: number) => {
        setCacheMeasure({});
        const { scrollOffset } = latestRef.current;
        const updateOffset = {
            left: scrollOffset.left * scale,
            top: scrollOffset.top * scale,
        };
        scrollTo(updateOffset, false);
    }, []);

    return {
        isSmoothScrolling,
        startIndex: start,
        startRange,
        endIndex: end,
        endRange,
        maxVisbilityIndex,
        virtualItems,
        getContainerStyles,
        getItemContainerStyles,
        getItemStyles,
        scrollToItem,
        scrollToNextItem,
        scrollToPreviousItem,
        zoom,
    };
};
