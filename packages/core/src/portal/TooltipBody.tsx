/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { usePosition } from '../hooks/usePosition';
import { Position } from '../structs/Position';
import { TextDirection, ThemeContext } from '../theme/ThemeContext';
import type { Offset } from '../types/Offset';
import { classNames } from '../utils/classNames';
import { Arrow } from './Arrow';

export const TooltipBody: React.FC<{
    ariaControlsSuffix: string;
    children?: React.ReactNode;
    contentRef: React.RefObject<HTMLDivElement>;
    offset: Offset;
    position: Position;
    targetRef: React.RefObject<HTMLElement>;
}> = ({ ariaControlsSuffix, children, contentRef, offset, position, targetRef }) => {
    const anchorRef = React.useRef<HTMLDivElement>();
    const { direction } = React.useContext(ThemeContext);
    const isRtl = direction === TextDirection.RightToLeft;

    usePosition(contentRef, targetRef, anchorRef, position, offset);

    return (
        <>
            <div ref={anchorRef} style={{ left: 0, position: 'absolute', top: 0 }} />
            <div
                className={classNames({
                    'rpv-core__tooltip-body': true,
                    'rpv-core__tooltip-body--rtl': isRtl,
                })}
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
