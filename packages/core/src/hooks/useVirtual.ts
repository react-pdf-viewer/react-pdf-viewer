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
import type { Offset } from '../types/Offset';
import type { Rect } from '../types/Rect';

interface ItemMeasurement {
    index: number;
    start: Offset;
    size: Rect;
    end: Offset;
    visibility: number;
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
        while (start - 1 >= 0 && measurements[start - 1].start.top === startTop && measurements[start - 1].start.left >= scrollOffset.left) {
            start--;
        }
    }

    let end = start;
    while (end < size) {
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

        // ┌────────────────────────┐─ ─ ─ ─ ─
        // |                        |
        // |                        |
        // |      Container         |   (1)
        // |                        |
        // |                        |
        // |                        |
        // └────────────────────────┘─ ─ ─ ─ ─
        // |                        |           
        // |           (2)          |   (3)
        // |                        |
        if (scrollMode === ScrollMode.Horizontal && visibleSize.width <= 0) {
            // The top left corner belongs to the (1) or (3) areas
            break;
        }
        if (scrollMode === ScrollMode.Vertical && visibleSize.height <= 0) {
            // The top left corner belongs to the (2) area
            break;
        }
        if (scrollMode === ScrollMode.Wrapped && (visibleSize.width <= 0 || visibleSize.height <= 0)) {
            break;
        }        

        // The top left corner now belongs to the container
        // Calculate the width that is visible within the container
        // There are two cases:  
        // - The top right corner is inside of the container
        // ┌────────────────────────┐
        // |   (top, left)          |
        // |        ●─ ─ ─ ─ ─●     |   visibility.width = 1
        // |           (top, right) |
        // |                        |
        // |                        |
        // └────────────────────────┘
        // - The top right corner is outside of the container
        // ┌────────────────────────┐
        // |   (top, left)          |       (top, right)
        // |        ●─ ─ ─ ─ ─ ─ ─ ─┼─ ─ ─ ─ ─ ─●
        // |                        |
        // |                        |   visibility.width = visibleSize.width / itemRect.width;
        // |                        |
        // └────────────────────────┘
        const visibilityWidth = itemRect.width <= visibleSize.width ? 1 : visibleSize.width / itemRect.width;
        
        // Calculate the height that is visible within the container
        // - The bottom left corner is inside of the container
        // ┌────────────────────────┐
        // |   (top, left)          |
        // |        ●               |
        // |        |               |   visibility.height = 1;
        // |        |               |
        // |        ● (bottom, left)|
        // └────────────────────────┘
        // - The bottom left corner is outside of the container
        // ┌────────────────────────┐
        // |   (top, left)          |
        // |        ●               |
        // |        |               |   visibility.height = visibleSize.height / itemRect.height;
        // |        |               |
        // |        |               |
        // └────────┼───────────────┘
        //          |
        //          ● (bottom, left)
        const visibilityHeight = itemRect.height <= visibleSize.height ? 1 : visibleSize.height / itemRect.height;

        console.log({end, visibilityWidth, visibilityHeight});
        end++;
    }
    
    // let end = start;
    // // The visiblities of each item
    // const visibilities: Record<string, number> = {};
    // let visibleSize: Rect = ZERO_RECT;
    // let lastVisibilityRect: Rect = ZERO_RECT;
    // let lastVisibility = 0;

    // while (end < size) {
    //     let allVisibleSize = {
    //         height: measurements[end].end.top - scrollOffset.top,
    //         width: measurements[end].end.left - scrollOffset.left,
    //     };
    //     lastVisibilityRect = {
    //         height: outerSize.height - allVisibleSize.height,
    //         width: outerSize.width - allVisibleSize.width,
    //     };
    //     if (scrollMode === ScrollMode.Horizontal && lastVisibilityRect.width <= 0) {
    //         visibilities[end] = allVisibleSize.width - visibleSize.width;
    //         lastVisibility = visibilities[end];
    //         visibleSize = allVisibleSize;
    //         break;
    //     }
    //     if (scrollMode === ScrollMode.Vertical && lastVisibilityRect.height <= 0) {
    //         visibilities[end] = allVisibleSize.height - visibleSize.height;
    //         lastVisibility = visibilities[end];
    //         visibleSize = allVisibleSize;
    //         break;
    //     }
    //     if (scrollMode === ScrollMode.Wrapped && lastVisibilityRect.height <= 0) {
    //         visibilities[end] = allVisibleSize.height - visibleSize.height;
    //         visibleSize = allVisibleSize;
    //         lastVisibility = visibilities[end];
           
    //         // Find the last item in the same row which has the same `top` value
    //         const top = measurements[end].start.top;
    //         const visibility = visibilities[end];

    //         while (end < size && measurements[end + 1].start.top === top) {
    //             end++;
    //             visibilities[end] = visibility;
    //         }
    //         break;
    //     }        
    //     end++;
    // }
    // visibilities[end] = lastVisibility;
    // console.log({start, end, visibilities})

    return {
        start,
        end: size,
        visibilities: {},
    };
};

export const useVirtual = ({
    estimateSize,
    isRtl,
    numberOfItems,
    overscan,
    parentRef,
    scrollMode,
}: {
    estimateSize: (index: number) => Rect;
    isRtl: boolean;
    numberOfItems: number;
    overscan: number;
    parentRef: React.MutableRefObject<HTMLDivElement>;
    scrollMode: ScrollMode;
}): {
    startIndex: number;
    endIndex: number;
    getContainerStyles: () => React.CSSProperties;
    getItemStyles: (item: ItemMeasurement) => React.CSSProperties;
    scrollToItem: (index: number, offset: Offset) => void;
    virtualItems: ItemMeasurement[];
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

    const measurements = React.useMemo(() => {
        const measurements: ItemMeasurement[] = [];

        let totalWidth = 0;
        let firstOfRow = {
            height: 0,
            left: 0,
            top: 0,            
        };
        for (let i = 0; i < numberOfItems; i++) {
            const size = estimateSize(i);
            let start = ZERO_OFFSET;
            if (i === 0) {
                totalWidth = size.width;
                firstOfRow = {
                    height: size.height,
                    left: 0,
                    top: 0,
                };
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
                        } else {
                            // Put the item in the next row
                            totalWidth = size.width;
                            start = {
                                left: firstOfRow.left,
                                top: firstOfRow.top + firstOfRow.height,
                            };
                            firstOfRow = {
                                height: size.height,
                                left: start.left,
                                top: start.top,
                            };
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
    }, [estimateSize, scrollMode, parentRect]);

    const totalSize = measurements[numberOfItems - 1] ? {
        height: measurements[numberOfItems - 1].end.top,
        width: measurements[numberOfItems - 1].end.left,
    } : ZERO_RECT;
    latestRef.current.measurements = measurements;
    latestRef.current.totalSize = totalSize;

    const { visibilities, start, end } = calculateRange(
        scrollMode,
        latestRef.current.measurements,
        latestRef.current.parentRect,
        latestRef.current.scrollOffset
    );

    const startRange = Math.max(start - overscan, 0);
    const endRange = Math.min(end + overscan, measurements.length - 1);

    const virtualItems = [];
    for (let i = startRange; i <= endRange; i++) {
        virtualItems.push({ ...measurements[i], visibility: visibilities[i] !== undefined ? visibilities[i] : -1 });
    }

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
        (item: ItemMeasurement): React.CSSProperties => {
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
        startIndex: startRange,
        endIndex: endRange,
        getContainerStyles,
        getItemStyles,
        scrollToItem,
        virtualItems,
    };
};
