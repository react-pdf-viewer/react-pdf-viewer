/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import { Toggle } from '../hooks/useToggle';
import Offset from './Offset';
import PopoverBody from './PopoverBody';
import PopoverOverlay from './PopoverOverlay';
import Portal, { RenderContent, RenderTarget } from './Portal';
import Position from './Position';

interface PopoverProps {
    closeOnClickOutside: boolean;
    closeOnEscape: boolean;
    content: RenderContent;
    offset: Offset;
    position: Position;
    target: RenderTarget;
}

const Popover: React.FC<PopoverProps> = ({ closeOnClickOutside, closeOnEscape, content, offset, position, target }) => {
    const targetRef = React.createRef<HTMLDivElement>();

    const renderTarget = (toggle: Toggle, opened: boolean): React.ReactElement => (<div ref={targetRef}>{target(toggle, opened)}</div>);

    const renderContent = (toggle: Toggle): React.ReactElement => (
        <>
        <PopoverOverlay
            closeOnEscape={closeOnEscape}
            onClose={toggle}
        />
        <PopoverBody
            closeOnClickOutside={closeOnClickOutside}
            offset={offset}
            position={position}
            targetRef={targetRef}
            onClose={toggle}
        >
            {content(toggle)}
        </PopoverBody>
        </>
    );

    return (
        <Portal
            content={renderContent}
            target={renderTarget}
        />
    );
};

export default Popover;
