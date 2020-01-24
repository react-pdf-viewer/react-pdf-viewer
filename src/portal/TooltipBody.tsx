/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

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

    usePosition(contentRef, targetRef, position, offset);

    return (
        <div
            ref={contentRef}
            style={{
                background: '#000',
                borderRadius: '4px',
                color: '#FFF',
                left: 0,
                maxWidth: '300px',
                position: 'absolute',
                textAlign: 'center',
                top: '-9999px',
                zIndex: 9999,
            }}
        >
            <Arrow position={position} styles={{ background: '#000' }} />
            {children}
        </div>
    );
};

export default TooltipBody;
