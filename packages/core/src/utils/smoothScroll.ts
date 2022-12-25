/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { ScrollDirection } from '../structs/ScrollDirection';
import type { Offset } from '../types/Offset';

const EPS = Number.EPSILON;

export const smoothScroll = (
    ele: HTMLDivElement,
    scrollDirection: ScrollDirection,
    targetPosition: Offset,
    duration: number,
    easing: (t: number) => number = (t) => t,
    onReachTarget: () => void = () => {}
) => {
    let top = 0;
    let left = 0;
    switch (scrollDirection) {
        case ScrollDirection.Horizontal:
            left = ele.scrollLeft;
            top = 0;
        case ScrollDirection.Both:
            left = ele.scrollLeft;
            top = ele.scrollTop;
            break;
        case ScrollDirection.Vertical:
        default:
            left = 0;
            top = ele.scrollTop;
            break;
    }

    if (top === targetPosition.top && scrollDirection === ScrollDirection.Vertical) {
        return;
    }
    if (left === targetPosition.left && scrollDirection === ScrollDirection.Horizontal) {
        return;
    }

    let startTime: number = -1;
    let requestId: number;
    const offset = {
        left: left - targetPosition.left,
        top: top - targetPosition.top,
    };

    const loop = (currentTime: number) => {
        if (startTime === -1) {
            startTime = currentTime;
        }

        // Elapsed time in miliseconds
        const time = currentTime - startTime;

        const percent = Math.min(time / duration, 1);
        const easedPercent = easing(percent);

        let updatePosition = {
            left: left - offset.left * easedPercent,
            top: top - offset.top * easedPercent,
        };
        switch (scrollDirection) {
            case ScrollDirection.Horizontal:
                ele.scrollLeft = updatePosition.left;
                break;
            case ScrollDirection.Both:
                ele.scrollLeft = updatePosition.left;
                ele.scrollTop = updatePosition.top;
                break;
            case ScrollDirection.Vertical:
            default:
                ele.scrollTop = updatePosition.top;
                break;
        }
        if (
            Math.abs(updatePosition.top - targetPosition.top) <= EPS &&
            Math.abs(updatePosition.left - targetPosition.left) <= EPS
        ) {
            onReachTarget();
        }

        if (time < duration) {
            // Continue moving
            requestId = window.requestAnimationFrame(loop);
        } else {
            window.cancelAnimationFrame(requestId);
        }
    };
    requestId = window.requestAnimationFrame(loop);
};
