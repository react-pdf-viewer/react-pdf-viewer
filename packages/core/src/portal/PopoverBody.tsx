/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import useClickOutside from '../hooks/useClickOutside';
import useIsomorphicLayoutEffect from '../hooks/useIsomorphicLayoutEffect';
import usePosition from '../hooks/usePosition';
import Arrow from './Arrow';
import Offset from './Offset';
import Position from './Position';

interface PopoverBodyProps {
    closeOnClickOutside: boolean;
    offset: Offset;
    position: Position;
    targetRef: React.RefObject<HTMLElement>;
    onClose(): void;
}

const PopoverBody: React.FC<PopoverBodyProps> = ({
    children,
    closeOnClickOutside,
    offset,
    position,
    targetRef,
    onClose,
}) => {
    const contentRef = React.useRef<HTMLDivElement>();
    const innerRef = React.useRef<HTMLDivElement>();
    const anchorRef = React.useRef<HTMLDivElement>();

    useClickOutside(closeOnClickOutside, contentRef, onClose);
    usePosition(contentRef, targetRef, anchorRef, position, offset);

    useIsomorphicLayoutEffect(() => {
        const innerContentEle = innerRef.current;
        if (!innerContentEle) {
            return;
        }

        // Limit the height of popover content
        const maxHeight = document.body.clientHeight * 0.75;
        if (innerContentEle.getBoundingClientRect().height >= maxHeight) {
            innerContentEle.style.overflow = 'auto';
            innerContentEle.style.maxHeight = `${maxHeight}px`;
        }
    }, []);

    return (
        <>
            <div ref={anchorRef} style={{ left: 0, position: 'absolute', top: 0 }} />
            <div className="rpv-core__popover-body" ref={contentRef}>
                <Arrow customClassName="rpv-core__popover-body-arrow" position={position} />
                <div ref={innerRef}>{children}</div>
            </div>
        </>
    );
};

export default PopoverBody;
