/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import Offset from '../portal/Offset';
import Position from '../portal/Position';
import calculatePosition from '../utils/calculatePosition';

const usePosition = (
    contentRef: React.RefObject<HTMLElement>,
    targetRef: React.RefObject<HTMLElement>,
    position: Position,
    offset: Offset,
) => {
    React.useEffect(() => {
        const targetEle = targetRef.current;
        const contentEle = contentRef.current;
        if (!contentEle || !targetEle) {
            return;
        }

        const { top, left } = calculatePosition(contentEle, targetEle, position, offset);
        contentEle.style.top = `${top}px`;
        contentEle.style.left = `${left}px`;
    }, []);
};

export default usePosition;
