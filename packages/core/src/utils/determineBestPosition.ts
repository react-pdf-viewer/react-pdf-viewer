/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { Position } from '../structs/Position';
import { type Offset } from '../types/Offset';
import { clamp } from './clamp';

const EMPTY_DOM_RECT = new DOMRect();
const AVAILABLE_POSITIONS = [
    // Top side
    Position.TopLeft,
    Position.TopCenter,
    Position.TopRight,
    // Right side
    Position.RightTop,
    Position.RightCenter,
    Position.RightBottom,
    // Bottom side
    Position.BottomLeft,
    Position.BottomCenter,
    Position.BottomRight,
    // Left side
    Position.LeftTop,
    Position.LeftCenter,
    Position.LeftBottom,
];

// Helpers
const isIntersection = (a: DOMRect, b: DOMRect) =>
    b.right >= a.left && b.left <= a.right && b.top <= a.bottom && b.bottom >= a.top;

const union = (a: DOMRect, b: DOMRect): DOMRect => {
    const left = Math.max(a.left, b.left);
    const top = Math.max(a.top, b.top);
    const right = Math.min(a.right, b.right);
    const bottom = Math.min(a.bottom, b.bottom);
    return new DOMRect(left, top, right - left, bottom - top);
};

const calculateArea = (rect: DOMRect): number => rect.width * rect.height;

const distance = (a: Offset, b: Offset): number => Math.abs(a.left - b.left) + Math.abs(a.top - b.top);

const calculateOffset = (position: Position, referenceRect: DOMRect, targetRect: DOMRect): Offset => {
    let top = 0;
    let left = 0;
    switch (position) {
        case Position.TopLeft:
            top = referenceRect.top - targetRect.height;
            left = referenceRect.left;
            break;
        case Position.TopCenter:
            top = referenceRect.top - targetRect.height;
            left = referenceRect.left + referenceRect.width / 2 - targetRect.width / 2;
            break;
        case Position.TopRight:
            top = referenceRect.top - targetRect.height;
            left = referenceRect.left + referenceRect.width - targetRect.width;
            break;
        case Position.RightTop:
            top = referenceRect.top;
            left = referenceRect.left + referenceRect.width;
            break;
        case Position.RightCenter:
            top = referenceRect.top + referenceRect.height / 2 - targetRect.height / 2;
            left = referenceRect.left + referenceRect.width;
            break;
        case Position.RightBottom:
            top = referenceRect.top + referenceRect.height - targetRect.height;
            left = referenceRect.left + referenceRect.width;
            break;

        case Position.BottomLeft:
            top = referenceRect.top + referenceRect.height;
            left = referenceRect.left;
            break;
        case Position.BottomCenter:
            top = referenceRect.top + referenceRect.height;
            left = referenceRect.left + referenceRect.width / 2 - targetRect.width / 2;
            break;
        case Position.BottomRight:
            top = referenceRect.top + referenceRect.height;
            left = referenceRect.left + referenceRect.width - targetRect.width;
            break;

        case Position.LeftTop:
            top = referenceRect.top;
            left = referenceRect.left - targetRect.width;
            break;
        case Position.LeftCenter:
            top = referenceRect.top + referenceRect.height / 2 - targetRect.height / 2;
            left = referenceRect.left - targetRect.width;
            break;
        case Position.LeftBottom:
            top = referenceRect.top + referenceRect.height - targetRect.height;
            left = referenceRect.left - targetRect.width;
            break;

        default:
            break;
    }
    return { top, left };
};

// Determine the best position to place a target element
export const determineBestPosition = (
    position: Position,
    referenceRect: DOMRect,
    targetRect: DOMRect,
    containerRect: DOMRect,
): DOMRect => {
    // Check if the reference element is outside of the container
    if (!isIntersection(referenceRect, containerRect)) {
        return EMPTY_DOM_RECT;
    }

    const desiredOffset = calculateOffset(position, referenceRect, targetRect);

    // Find the positions that won't make the target overflow
    const availableOffsets = AVAILABLE_POSITIONS.map((pos) => calculateOffset(pos, referenceRect, targetRect));
    const notOverflowOffsets = availableOffsets.filter((offset) => {
        const rect = new DOMRect(offset.left, offset.top, targetRect.width, targetRect.height);
        return isIntersection(rect, containerRect);
    });

    // Sort by the distance calculated from the desired position
    const sortedDistances = notOverflowOffsets.sort((a, b) => {
        const x = new DOMRect(b.left, b.top, targetRect.width, targetRect.height);
        const y = new DOMRect(a.left, a.top, targetRect.width, targetRect.height);
        return (
            calculateArea(union(x, containerRect)) - calculateArea(union(y, containerRect)) ||
            distance(a, desiredOffset) - distance(b, desiredOffset)
        );
    });

    if (sortedDistances.length === 0) {
        return EMPTY_DOM_RECT;
    }
    const { top, left } = sortedDistances[0];
    const shortestDistanceRect = new DOMRect(left, top, targetRect.width, targetRect.height);

    return new DOMRect(
        Math.round(
            clamp(shortestDistanceRect.left, containerRect.left, containerRect.right - shortestDistanceRect.width),
        ),
        Math.round(
            clamp(shortestDistanceRect.top, containerRect.top, containerRect.bottom - shortestDistanceRect.height),
        ),
        shortestDistanceRect.width,
        shortestDistanceRect.height,
    );
};
