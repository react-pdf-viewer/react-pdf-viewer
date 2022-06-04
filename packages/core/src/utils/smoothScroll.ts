/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { ScrollMode } from '../structs/ScrollMode';

export const smoothScroll = (
    ele: HTMLDivElement,
    scrollMode: ScrollMode,
    targetPosition: number,
    duration: number,
    easing: (t: number) => number
) => {
    let start = 0;
    switch (scrollMode) {
        case ScrollMode.Horizontal:
            start = ele.scrollLeft;
        case ScrollMode.Vertical:
        default:
            start = ele.scrollTop;
            break;
    }

    let startTime: number = -1;
    let requestId: number;
    const offset = start - targetPosition;
    if (offset === 0) {
        return;
    }

    const loop = (currentTime: number) => {
        if (startTime === -1) {
            startTime = currentTime;
        }

        // Elapsed time in miliseconds
        const time = currentTime - startTime;

        const percent = Math.min(time / duration, 1);
        const easedPercent = easing(percent);

        switch (scrollMode) {
            case ScrollMode.Horizontal:
                ele.scrollLeft = start - offset * easedPercent;
            case ScrollMode.Vertical:
            default:
                ele.scrollTop = start - offset * easedPercent;
                break;
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
