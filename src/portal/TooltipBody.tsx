/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import usePosition from '../hooks/usePosition';
import ThemeContent from '../theme/ThemeContext';
import Arrow from './Arrow';
import Offset from './Offset';
import Position from './Position';
import './tooltipBody.less';

interface TooltipBodyProps {
    offset: Offset;
    position: Position;
    targetRef: React.RefObject<HTMLElement>;
}

const TooltipBody: React.FC<TooltipBodyProps> = ({ children, offset, position, targetRef }) => {
    const theme = React.useContext(ThemeContent);
    const contentRef = React.createRef<HTMLDivElement>();

    usePosition(contentRef, targetRef, position, offset);

    return (
        <div className={`${theme.prefixClass}-tooltip-body`} ref={contentRef}>
            <Arrow customClassName={`${theme.prefixClass}-tooltip-body-arrow`} position={position} />
            {children}
        </div>
    );
};

export default TooltipBody;
