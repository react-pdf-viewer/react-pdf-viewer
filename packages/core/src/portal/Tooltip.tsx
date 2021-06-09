/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import { Toggle, ToggleStatus } from '../hooks/useToggle';
import Offset from './Offset';
import Portal from './Portal';
import Position from './Position';
import TooltipBody from './TooltipBody';

type RenderTooltipContent = () => React.ReactNode;

interface TooltipProps {
    content: RenderTooltipContent;
    offset: Offset;
    position: Position;
    target: React.ReactElement;
}

const Tooltip: React.FC<TooltipProps> = ({ content, offset, position, target }) => {
    const targetRef = React.useRef<HTMLDivElement>();

    const renderTarget = (toggle: Toggle): React.ReactElement => {
        const show = (): void => { toggle(ToggleStatus.Open); };
        const hide = (): void => { toggle(ToggleStatus.Close); };
        return (
            <div
                ref={targetRef}
                onMouseEnter={show}
                onMouseLeave={hide}
            >
                {target}
            </div>
        );
    };

    const renderContent = (): React.ReactElement => (
        <TooltipBody
            offset={offset}
            position={position}
            targetRef={targetRef}
        >
            {content()}
        </TooltipBody>
    );

    return (
        <Portal
            target={renderTarget}
            content={renderContent}
        />
    );
};

export default Tooltip;
