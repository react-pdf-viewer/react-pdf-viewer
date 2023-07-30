/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { ScrollMode } from '../structs/ScrollMode';
import { ViewMode } from '../structs/ViewMode';
import { type Rect } from '../types/Rect';
import { chunk } from '../utils/chunk';
import { type VirtualItem } from './VirtualItem';

const hasDifferentSizes = (sizes: Rect[]): boolean => {
    const numberOfItems = sizes.length;
    if (numberOfItems === 1) {
        return false;
    }
    for (let i = 1; i < numberOfItems; i++) {
        if (sizes[i].height !== sizes[0].height || sizes[i].width !== sizes[0].width) {
            return true;
        }
    }
    return false;
};

// Determine the min width in the `DualPageWithCover` mode
const getMinWidthOfCover = (sizes: Rect[], viewMode: ViewMode): number => {
    if (viewMode !== ViewMode.DualPageWithCover) {
        return 0;
    }
    if (!hasDifferentSizes(sizes)) {
        return 2 * sizes[0].width;
    }
    const chunkWidths = chunk(sizes.slice(1), 2).map((eachChunk) =>
        eachChunk.length === 2 ? eachChunk[0].width + eachChunk[1].width : eachChunk[0].width,
    );
    const widths = [sizes[0].width].concat(chunkWidths);
    return Math.max(...widths);
};

export const buildItemStyles = (
    item: VirtualItem,
    isRtl: boolean,
    sizes: Rect[],
    viewMode: ViewMode,
    scrollMode: ScrollMode,
): React.CSSProperties => {
    const sideProperty = isRtl ? 'right' : 'left';
    const factor = isRtl ? -1 : 1;
    const numberOfItems = sizes.length;
    const left = item.start.left * factor;
    const { height, width } = item.size;

    if (viewMode === ViewMode.DualPageWithCover) {
        const transformTop = scrollMode === ScrollMode.Page ? 0 : item.start.top;
        // The first and the last items are treated as covers
        if (item.index === 0 || (numberOfItems % 2 === 0 && item.index === numberOfItems - 1)) {
            return {
                // Size
                height: `${height}px`,
                minWidth: `${getMinWidthOfCover(sizes, viewMode)}px`,
                width: '100%',
                // Absolute position
                [sideProperty]: 0,
                position: 'absolute',
                top: 0,
                transform: `translate(${left}px, ${transformTop}px)`,
            };
        }

        return {
            // Size
            height: `${height}px`,
            width: `${width}px`,
            // Absolute position
            [sideProperty]: 0,
            position: 'absolute',
            top: 0,
            transform: `translate(${left}px, ${transformTop}px)`,
        };
    }

    if (viewMode === ViewMode.DualPage) {
        return {
            // Size
            height: `${height}px`,
            width: `${width}px`,
            // Absolute position
            [sideProperty]: 0,
            position: 'absolute',
            top: 0,
            transform: `translate(${left}px, ${scrollMode === ScrollMode.Page ? 0 : item.start.top}px)`,
        };
    }

    switch (scrollMode) {
        case ScrollMode.Horizontal:
            return {
                // Size
                height: '100%',
                width: `${width}px`,
                // Absolute position
                [sideProperty]: 0,
                position: 'absolute',
                top: 0,
                transform: `translateX(${left}px)`,
            };
        case ScrollMode.Page:
            return {
                // Size
                height: `${height}px`,
                width: `${width}px`,
                // Absolute position
                [sideProperty]: 0,
                position: 'absolute',
                top: 0,
            };
        case ScrollMode.Wrapped:
            return {
                // Size
                height: `${height}px`,
                width: `${width}px`,
                // Absolute position
                [sideProperty]: 0,
                position: 'absolute',
                top: 0,
                transform: `translate(${left}px, ${item.start.top}px)`,
            };
        case ScrollMode.Vertical:
        default:
            return {
                // Size
                height: `${height}px`,
                width: '100%',
                // Absolute position
                [sideProperty]: 0,
                position: 'absolute',
                top: 0,
                transform: `translateY(${item.start.top}px)`,
            };
    }
};
