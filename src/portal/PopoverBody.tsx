/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import useKeyUp from '../hooks/useKeyUp';
import usePosition from '../hooks/usePosition';
import Arrow from './Arrow';
import Offset from './Offset';
import Position from './Position';

interface PopoverBodyProps {
    closeOnEscape: boolean;
    offset: Offset;
    position: Position;
    targetRef: React.RefObject<HTMLElement>;
    onToggle(): void;
}

const PopoverBody: React.FC<PopoverBodyProps> = ({
    children, closeOnEscape, offset, position, targetRef, onToggle,
}) => {
    const contentRef = React.createRef<HTMLDivElement>();

    useKeyUp(27, () => closeOnEscape && onToggle());
    usePosition(contentRef, targetRef, position, offset);

    return (
        <div
            ref={contentRef}
            style={{
                background: '#FFF',
                border: '1px solid rgba(0, 0, 0, 0.3)',
                borderRadius: '4px',
                left: 0,
                position: 'absolute',
                top: '-9999px',
                zIndex: 9999,
            }}
        >
            <Arrow position={position} styles={{ background: '#FFF' }} />
            {children}
        </div>
    );
};

export default PopoverBody;
