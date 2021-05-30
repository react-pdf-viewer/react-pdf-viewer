/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import usePosition from '../hooks/usePosition';
import Arrow from './Arrow';
import Offset from './Offset';
import Position from './Position';

interface TooltipBodyProps {
    offset: Offset;
    position: Position;
    targetRef: React.RefObject<HTMLElement>;
}

const TooltipBody: React.FC<TooltipBodyProps> = ({ children, offset, position, targetRef }) => {
    const contentRef = React.createRef<HTMLDivElement>();
    const anchorRef = React.createRef<HTMLDivElement>();

    usePosition(contentRef, targetRef, anchorRef, position, offset);

    return (
        <>
            <div
                ref={anchorRef}
                style={{ left: 0, position: 'absolute', top: 0 }}
            />
            <div className='rpv-core__tooltip-body' ref={contentRef}>
                <Arrow customClassName='rpv-core__tooltip-body-arrow' position={position} />
                <div className='rpv-core__tooltip-body-content'>
                    {children}
                </div>
            </div>
        </>
    );
};

export default TooltipBody;
