/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { Offset } from '@react-pdf-viewer/core';

export const calculateOffset = (children: HTMLElement, parent: HTMLElement): Offset => {
    let top = children.offsetTop;
    let left = children.offsetLeft;

    let p = children.parentElement;
    while (p && p !== parent) {
        top += p.offsetTop;
        left += p.offsetLeft;
        p = p.parentElement;
    }
    return {
        left,
        top,
    };
};
