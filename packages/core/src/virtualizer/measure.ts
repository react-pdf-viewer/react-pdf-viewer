/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { ScrollMode } from '../structs/ScrollMode';
import type { Offset } from '../types/Offset';
import type { Rect } from '../types/Rect';
import type { ItemMeasurement } from './ItemMeasurement';

const ZERO_OFFSET: Offset = {
    left: 0,
    top: 0,
};

export const measure = (
    numberOfItems: number,
    parentRect: Rect,
    sizes: Rect[],
    scrollMode: ScrollMode
): ItemMeasurement[] => {
    const measurements: ItemMeasurement[] = [];
    let totalWidth = 0;
    let firstOfRow = {
        left: 0,
        top: 0,
    };
    // Maximum height of items which are in the same row (in the wrapped layout mode)
    // The value will be used to calculate the `start` position for items in the next row
    let maxHeight = 0;
    let start = ZERO_OFFSET;

    for (let i = 0; i < numberOfItems; i++) {
        const size = sizes[i];
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
};
