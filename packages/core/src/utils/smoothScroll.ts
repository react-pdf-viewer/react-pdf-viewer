/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { ScrollDirection } from '../structs/ScrollDirection';
import { type Offset } from '../types/Offset';

const EPS = 0.0001;

export const smoothScroll = (
    ele: HTMLDivElement,
    scrollDirection: ScrollDirection,
    targetPosition: Offset,
    duration: number,
    easing: (t: number) => number = (t) => t,
    onReachTarget: () => void = () => {},
) => {
    let top = 0;
    let left = 0;
    let reachTarget = false;
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

    const markTargetReached = () => {
        if (!reachTarget) {
            // To make sure that `onReachTarget` will be executed once
            reachTarget = true;
            ele.scrollLeft = targetPosition.left;
            ele.scrollTop = targetPosition.top;
            onReachTarget();
        }
    };

    if (Math.abs(top - targetPosition.top) <= EPS && scrollDirection === ScrollDirection.Vertical) {
        markTargetReached();
        return;
    }
    if (Math.abs(left - targetPosition.left) <= EPS && scrollDirection === ScrollDirection.Horizontal) {
        markTargetReached();
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
            Math.abs(updatePosition.left - targetPosition.left) <= EPS &&
            !reachTarget
        ) {
            window.cancelAnimationFrame(requestId);
            markTargetReached();
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
