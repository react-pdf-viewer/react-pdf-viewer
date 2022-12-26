/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { useMeasureRect } from '../hooks/useMeasureRect';
import { useScroll } from '../hooks/useScroll';
import { ScrollDirection } from '../structs/ScrollDirection';
import { ScrollMode } from '../structs/ScrollMode';
import { ViewMode } from '../structs/ViewMode';
import type { Offset } from '../types/Offset';
import type { Rect } from '../types/Rect';
import { chunk } from '../utils/chunk';
import { clamp } from '../utils/clamp';
import { findNearest } from '../utils/findNearest';
import { measureDualWithCover } from './measureDualWithCover';
import type { VirtualItem } from './VirtualItem';

const ZERO_RECT: Rect = {
    height: 0,
    width: 0,
};
const ZERO_OFFSET: Offset = {
    left: 0,
    top: 0,
};

const COMPARE_EPSILON = 0.000000000001;

const calculateRange = (
    scrollDirection: ScrollDirection,
    measurements: VirtualItem[],
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
    isRtl,
    numberOfItems,
    parentRef,
    setStartRange,
    setEndRange,
    sizes,
    scrollMode,
    viewMode,
}: {
    isRtl: boolean;
    numberOfItems: number;
    parentRef: React.MutableRefObject<HTMLDivElement>;
    setStartRange(startIndex: number): number;
    setEndRange(endIndex: number): number;
    // Sizes of items
    sizes: Rect[];
    scrollMode: ScrollMode;
    viewMode: ViewMode;
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
    zoom: (scale: number, index: number) => void;
} => {
    const [isSmoothScrolling, setSmoothScrolling] = React.useState(false);
    const onSmoothScroll = React.useCallback((isSmoothScrolling: boolean) => setSmoothScrolling(isSmoothScrolling), []);

    const scrollModeRef = React.useRef(scrollMode);
    scrollModeRef.current = scrollMode;

    const viewModeRef = React.useRef(viewMode);
    viewModeRef.current = viewMode;

    const scrollDirection =
        scrollMode === ScrollMode.Wrapped || viewMode === ViewMode.DualPageWithCover || viewMode === ViewMode.DualPage
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
        measurements: [] as VirtualItem[],
        parentRect: ZERO_RECT,
        totalSize: ZERO_RECT,
    });
    latestRef.current.scrollOffset = scrollOffset;
    latestRef.current.parentRect = parentRect;

    const measurements = React.useMemo(() => {
        const measurements: VirtualItem[] = [];

        // Single page scrolling mode
        if (scrollMode === ScrollMode.Page && viewMode === ViewMode.SinglePage) {
            for (let i = 0; i < numberOfItems; i++) {
                const size = {
                    height: Math.max(parentRect.height, sizes[i].height),
                    width: Math.max(parentRect.width, sizes[i].width),
                };
                const start: Offset = i === 0 ? ZERO_OFFSET : measurements[i - 1].end;
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

        // `DualPageWithCover` mode
        if (viewMode === ViewMode.DualPageWithCover) {
            return measureDualWithCover(numberOfItems, parentRect, sizes, scrollMode);
        }

        // `DualPage` mode
        if (viewMode === ViewMode.DualPage) {
            for (let i = 0; i < numberOfItems; i++) {
                const size = {
                    height:
                        scrollMode === ScrollMode.Page ? Math.max(parentRect.height, sizes[i].height) : sizes[i].height,
                    width: Math.max(parentRect.width / 2, sizes[i].width),
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

        // `SinglePage` mode
        let totalWidth = 0;
        let firstOfRow = {
            left: 0,
            top: 0,
        };
        // Maximum height of items which are in the same row (in the wrapped layout mode)
        // The value will be used to calculate the `start` position for items in the next row
        let maxHeight = 0;
        for (let i = 0; i < numberOfItems; i++) {
            const size = sizes[i];
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
    }, [scrollMode, sizes, viewMode, parentRect]);

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

    // Determine the page that has max visbility and the range of pages that will be pre-rendered
    let maxVisbilityIndex = maxVisbilityItem;
    let startRange = setStartRange(start);
    let endRange = setEndRange(end);

    switch (viewMode) {
        case ViewMode.DualPageWithCover:
            if (maxVisbilityItem > 0) {
                maxVisbilityIndex = maxVisbilityItem % 2 === 1 ? maxVisbilityItem : maxVisbilityItem - 1;
            }
            startRange = startRange === 0 ? 0 : startRange % 2 === 1 ? startRange : startRange - 1;
            endRange = endRange % 2 === 1 ? endRange - 1 : endRange;
            if (numberOfItems - endRange <= 2) {
                endRange = numberOfItems - 1;
            }
            break;
        case ViewMode.DualPage:
            maxVisbilityIndex = maxVisbilityItem % 2 === 0 ? maxVisbilityItem : maxVisbilityItem - 1;
            startRange = startRange % 2 === 0 ? startRange : startRange - 1;
            endRange = endRange % 2 === 1 ? endRange : endRange - 1;
            break;
        case ViewMode.SinglePage:
        default:
            maxVisbilityIndex = maxVisbilityItem;
            break;
    }

    const virtualItems = React.useMemo(() => {
        const virtualItems: VirtualItem[] = [];

        for (let i = startRange; i <= endRange; i++) {
            const item = measurements[i];
            const virtualItem: VirtualItem = {
                ...item,
                visibility: visibilities[i] !== undefined ? visibilities[i] : -1,
            };
            virtualItems.push(virtualItem);
        }

        return virtualItems;
    }, [visibilities, measurements]);

    const scrollToItem = React.useCallback(
        (index: number, offset: Offset) => {
            const { measurements } = latestRef.current;
            const normalizedIndex = clamp(0, numberOfItems - 1, index);
            const measurement = measurements[normalizedIndex];
            // Ignore the offset in the single page scrolling mode
            const withOffset = scrollModeRef.current === ScrollMode.Page ? ZERO_OFFSET : offset;
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
        const nextItem = measurements.find((item) => item.start.top - start.top > COMPARE_EPSILON);
        if (!nextItem) {
            return;
        }
        let nextIndex = nextItem.index;
        switch (viewModeRef.current) {
            case ViewMode.DualPage:
                nextIndex = nextIndex % 2 === 0 ? nextIndex : nextIndex + 1;
                break;
            case ViewMode.DualPageWithCover:
                nextIndex = nextIndex % 2 === 1 ? nextIndex : nextIndex + 1;
                break;
            default:
                break;
        }
        scrollToItem(nextIndex, offset);
    }, []);

    const scrollToBiggestItemBelow = React.useCallback((index: number, offset: Offset) => {
        const { measurements } = latestRef.current;
        const start = measurements[index].start;
        // Find the smallest item whose `top` is smaller than the current item
        // Because `findLast` isn't available for ES5 target
        let prevIndex = index;
        let found = false;
        for (let i = numberOfItems - 1; i >= 0; i--) {
            if (start.top - measurements[i].start.top > COMPARE_EPSILON) {
                found = true;
                prevIndex = measurements[i].index;
                break;
            }
        }
        if (!found) {
            return;
        }
        switch (viewModeRef.current) {
            case ViewMode.DualPage:
                prevIndex = prevIndex % 2 === 0 ? prevIndex : prevIndex - 1;
                break;
            case ViewMode.DualPageWithCover:
                prevIndex = prevIndex % 2 === 0 ? prevIndex - 1 : prevIndex;
                break;
            default:
                break;
        }
        if (prevIndex === index) {
            prevIndex = index - 1;
        }
        scrollToItem(prevIndex, offset);
    }, []);

    const scrollToNextItem = React.useCallback((index: number, offset: Offset) => {
        // `DualPage` mode
        if (viewModeRef.current === ViewMode.DualPageWithCover || viewModeRef.current === ViewMode.DualPage) {
            scrollToSmallestItemAbove(index, offset);
            return;
        }

        // `SinglePage` mode
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
        // `DualPage` mode
        if (viewModeRef.current === ViewMode.DualPageWithCover || viewModeRef.current === ViewMode.DualPage) {
            scrollToBiggestItemBelow(index, offset);
            return;
        }

        // `SinglePage` mode
        switch (scrollModeRef.current) {
            case ScrollMode.Wrapped:
                scrollToBiggestItemBelow(index, offset);
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
            return scrollModeRef.current !== ScrollMode.Page
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

    // Determine the min width in the `DualPageWithCover` mode
    const hasDifferentSizes = React.useMemo(() => {
        if (numberOfItems === 1) {
            return false;
        }
        for (let i = 1; i < numberOfItems; i++) {
            if (sizes[i].height !== sizes[0].height || sizes[i].width !== sizes[0].width) {
                return true;
            }
        }
        return false;
    }, [sizes]);

    const minWidthOfCover = React.useMemo(() => {
        if (viewModeRef.current !== ViewMode.DualPageWithCover) {
            return 0;
        }
        if (!hasDifferentSizes) {
            return 2 * sizes[0].width;
        }
        const chunkWidths = chunk(sizes.slice(1), 2).map((eachChunk) =>
            eachChunk.length === 2 ? eachChunk[0].width + eachChunk[1].width : eachChunk[0].width
        );
        const widths = [sizes[0].width].concat(chunkWidths);
        return Math.max(...widths);
    }, [sizes]);

    // Build the absolute position styles for each item
    const getItemStyles = React.useCallback(
        (item: VirtualItem): React.CSSProperties => {
            const sideProperty = isRtl ? 'right' : 'left';
            const factor = isRtl ? -1 : 1;

            if (viewModeRef.current === ViewMode.DualPageWithCover) {
                const transformTop = scrollModeRef.current === ScrollMode.Page ? 0 : item.start.top;
                // The first and the last items are treated as covers
                if (item.index === 0 || (numberOfItems % 2 === 0 && item.index === numberOfItems - 1)) {
                    return {
                        // Size
                        height: `${item.size.height}px`,
                        minWidth: `${minWidthOfCover}px`,
                        width: '100%',
                        // Absolute position
                        [sideProperty]: 0,
                        position: 'absolute',
                        top: 0,
                        transform: `translate(${item.start.left}px, ${transformTop}px)`,
                    };
                }

                return {
                    // Size
                    height: `${item.size.height}px`,
                    width: `${item.size.width}px`,
                    // Absolute position
                    [sideProperty]: 0,
                    position: 'absolute',
                    top: 0,
                    transform: `translate(${item.start.left}px, ${transformTop}px)`,
                };
            }

            if (viewModeRef.current === ViewMode.DualPage) {
                return {
                    // Size
                    height: `${item.size.height}px`,
                    width: `${item.size.width}px`,
                    // Absolute position
                    [sideProperty]: 0,
                    position: 'absolute',
                    top: 0,
                    transform: `translate(${item.start.left}px, ${
                        scrollModeRef.current === ScrollMode.Page ? 0 : item.start.top
                    }px)`,
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
                        height: `${item.size.height}px`,
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
        [isRtl, sizes]
    );

    // Zoom to the given item
    const zoom = React.useCallback((scale: number, index: number) => {
        const { measurements, scrollOffset } = latestRef.current;
        const normalizedIndex = clamp(0, numberOfItems - 1, index);
        const measurement = measurements[normalizedIndex];
        if (measurement) {
            const updateOffset =
                scrollModeRef.current === ScrollMode.Page
                    ? {
                          left: measurement.start.left,
                          top: measurement.start.top,
                      }
                    : {
                          left: scrollOffset.left * scale,
                          top: scrollOffset.top * scale,
                      };
            scrollTo(updateOffset, false);
        }
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
