/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
import { Position } from '../structs/Position';
import type { Offset } from '../types/Offset';
import { calculatePosition } from '../utils/calculatePosition';

export const usePosition = (
    contentRef: React.RefObject<HTMLElement>,
    targetRef: React.RefObject<HTMLElement>,
    anchorRef: React.RefObject<HTMLElement>,
    position: Position,
    offset: Offset
): void => {
    useIsomorphicLayoutEffect(() => {
        const targetEle = targetRef.current;
        const contentEle = contentRef.current;
        const anchorEle = anchorRef.current;
        if (!contentEle || !targetEle || !anchorEle) {
            return;
        }

        const anchorRect = anchorEle.getBoundingClientRect();
        const { top, left } = calculatePosition(contentEle, targetEle, position, offset);
        contentEle.style.top = `${top - anchorRect.top}px`;
        contentEle.style.left = `${left - anchorRect.left}px`;
    }, []);
};
