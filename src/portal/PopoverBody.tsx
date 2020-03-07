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
import ThemeContent from '../theme/ThemeContext';
import Arrow from './Arrow';
import Offset from './Offset';
import './popoverBody.less';
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
    const theme = React.useContext(ThemeContent);
    const contentRef = React.createRef<HTMLDivElement>();

    useKeyUp(27, () => closeOnEscape && onToggle());
    usePosition(contentRef, targetRef, position, offset);

    return (
        <div className={`${theme.prefixClass}-popover-body`} ref={contentRef}>
            <Arrow customClassName={`${theme.prefixClass}-popover-body-arrow`} position={position} />
            {children}
        </div>
    );
};

export default PopoverBody;
