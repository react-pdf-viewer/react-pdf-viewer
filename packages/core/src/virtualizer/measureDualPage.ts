/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { ScrollMode } from '../structs/ScrollMode';
import { type Offset } from '../types/Offset';
import { type Rect } from '../types/Rect';
import { type ItemMeasurement } from './ItemMeasurement';

const ZERO_OFFSET: Offset = {
    left: 0,
    top: 0,
};

export const measureDualPage = (
    numberOfItems: number,
    parentRect: Rect,
    sizes: Rect[],
    scrollMode: ScrollMode,
): ItemMeasurement[] => {
    const measurements: ItemMeasurement[] = [];
    let top = 0;
    let maxHeight = 0;
    let start = ZERO_OFFSET;

    for (let i = 0; i < numberOfItems; i++) {
        const size = {
            height: scrollMode === ScrollMode.Page ? Math.max(parentRect.height, sizes[i].height) : sizes[i].height,
            width: Math.max(parentRect.width / 2, sizes[i].width),
        };

        if (scrollMode === ScrollMode.Page) {
            start = {
                left: i % 2 === 0 ? 0 : size.width,
                top: Math.floor(i / 2) * size.height,
            };
        } else {
            if (i % 2 === 0) {
                top = top + maxHeight;
                start = {
                    left: 0,
                    top,
                };
                maxHeight = i === numberOfItems - 1 ? sizes[i].height : Math.max(sizes[i].height, sizes[i + 1].height);
            } else {
                start = {
                    left: measurements[i - 1].end.left,
                    top,
                };
            }
        }

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
};
