/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useLayoutEffect } from 'react';

import Offset from '../portal/Offset';
import Position from '../portal/Position';
import calculatePosition from '../utils/calculatePosition';

const usePosition = (
    contentRef: React.RefObject<HTMLElement>,
    targetRef: React.RefObject<HTMLElement>,
    anchorRef: React.RefObject<HTMLElement>,
    position: Position,
    offset: Offset,
): void => {
    useLayoutEffect(() => {
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

export default usePosition;
