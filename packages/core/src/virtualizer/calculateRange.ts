/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { ScrollDirection } from '../structs/ScrollDirection';
import { type Offset } from '../types/Offset';
import { type Rect } from '../types/Rect';
import { findNearest } from '../utils/findNearest';
import { type ItemMeasurement } from './ItemMeasurement';

export const calculateRange = (
    scrollDirection: ScrollDirection,
    measurements: ItemMeasurement[],
    outerSize: Rect,
    scrollOffset: Offset,
): {
    start: number;
    end: number;
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
    while (end <= size) {
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
            break;
        }
        if (scrollDirection === ScrollDirection.Vertical && visibleSize.height < 0) {
            // The top left corner belongs to the (4, 5) areas
            break;
        }
        if (scrollDirection === ScrollDirection.Both && (visibleSize.width < 0 || visibleSize.height < 0)) {
            // The top left corner belongs to the (2, 3, 4, 5) areas
            break;
        }
        end++;
    }

    return {
        start,
        end,
    };
};
