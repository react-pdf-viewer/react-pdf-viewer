/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import useKeyUp from '../hooks/useKeyUp';
import { Toggle, ToggleStatus } from '../hooks/useToggle';
import Offset from './Offset';
import Portal from './Portal';
import Position from './Position';
import TooltipBody from './TooltipBody';
import uniqueId from '../utils/uniqueId';

type RenderTooltipContent = () => React.ReactNode;

interface TooltipProps {
    ariaControlsSuffix?: string;
    content: RenderTooltipContent;
    offset: Offset;
    position: Position;
    target: React.ReactElement;
}

const Tooltip: React.FC<TooltipProps> = ({ ariaControlsSuffix, content, offset, position, target }) => {
    const targetRef = React.useRef<HTMLDivElement>();
    const controlsSuffix = ariaControlsSuffix || `${uniqueId()}`;

    const renderTarget = (toggle: Toggle): React.ReactElement => {
        useKeyUp(27, () => {
            if (targetRef.current && document.activeElement && targetRef.current.contains(document.activeElement)) {
                hide();
            }
        });

        const show = (): void => {
            toggle(ToggleStatus.Open);
        };
        const hide = (): void => {
            toggle(ToggleStatus.Close);
        };
        return (
            <div
                aria-describedby={`rpv-core__tooltip-body-${controlsSuffix}`}
                ref={targetRef}
                onBlur={hide}
                onFocus={show}
                onMouseEnter={show}
                onMouseLeave={hide}
            >
                {target}
            </div>
        );
    };

    const renderContent = (): React.ReactElement => (
        <TooltipBody ariaControlsSuffix={controlsSuffix} offset={offset} position={position} targetRef={targetRef}>
            {content()}
        </TooltipBody>
    );

    return <Portal target={renderTarget} content={renderContent} />;
};

export default Tooltip;
