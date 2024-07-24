/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { Breakpoint } from '../structs/Breakpoint';

export const determineBreakpoint = (width: number): Breakpoint => {
    switch (true) {
        case width <= 36 * 16:
            return Breakpoint.ExtraSmall;
        case width <= 48 * 16:
            return Breakpoint.Small;
        case width <= 62 * 16:
            return Breakpoint.Medium;
        case width <= 75 * 16:
            return Breakpoint.Large;
        default:
            return Breakpoint.ExtraLarge;
    }
};
