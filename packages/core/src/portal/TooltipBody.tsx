/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import { usePosition } from '../hooks/usePosition';
import { Position } from '../struct/Position';
import { Arrow } from './Arrow';
import type { Offset } from '../types/Offset';

export const TooltipBody: React.FC<{
    ariaControlsSuffix: string;
    contentRef: React.RefObject<HTMLDivElement>;
    offset: Offset;
    position: Position;
    targetRef: React.RefObject<HTMLElement>;
}> = ({
    ariaControlsSuffix,
    children,
    contentRef,
    offset,
    position,
    targetRef,
}) => {
    const anchorRef = React.useRef<HTMLDivElement>();

    usePosition(contentRef, targetRef, anchorRef, position, offset);

    return (
        <>
            <div ref={anchorRef} style={{ left: 0, position: 'absolute', top: 0 }} />
            <div
                className="rpv-core__tooltip-body"
                id={`rpv-core__tooltip-body-${ariaControlsSuffix}`}
                ref={contentRef}
                role="tooltip"
            >
                <Arrow customClassName="rpv-core__tooltip-body-arrow" position={position} />
                <div className="rpv-core__tooltip-body-content">{children}</div>
            </div>
        </>
    );
};
