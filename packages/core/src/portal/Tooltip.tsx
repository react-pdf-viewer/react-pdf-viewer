/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';
import { useToggle } from '../hooks/useToggle';
import { Position } from '../structs/Position';
import { ToggleStatus } from '../structs/ToggleStatus';
import { uniqueId } from '../utils/uniqueId';
import { Portal } from './Portal';
import { TooltipBody } from './TooltipBody';

type RenderTooltipContent = () => React.ReactNode;

export const Tooltip: React.FC<{
    ariaControlsSuffix?: string;
    content: RenderTooltipContent;
    position: Position;
    target: React.ReactElement;
}> = ({ ariaControlsSuffix, content, position, target }) => {
    const { opened, toggle } = useToggle(false);
    const targetRef = React.useRef<HTMLDivElement>();
    const contentRef = React.useRef<HTMLDivElement>();
    const controlsSuffix = React.useMemo(() => ariaControlsSuffix || `${uniqueId()}`, []);

    const open = (): void => {
        toggle(ToggleStatus.Open);
    };
    const close = (): void => {
        toggle(ToggleStatus.Close);
    };

    const onBlur = (e: React.FocusEvent) => {
        // Support the case that the parent element of tooltip contains an element
        // that is focused on automatically
        // For example
        //  <Popover
        //      target=() => {
        //          <Tooltip
        //              target=<MinimalButton />
        //          />
        //      }
        //      content=() => <Menu />
        //  />
        // The following events happen when the tooltip gets focused:
        // - The tooltip is shown
        // - The button gets focused. Pressing `Enter` will open the popover
        // - The first menu item is focused on automatically. It triggers the `blur` event of the tooltip
        // At this moment, we can't destroy the tooltip, because it will destroy the popover too.
        // Instead, we hide it via CSS, and destroy it later

        // We have to use `parentElement` here due to the markup structure
        //  Popover
        //      Tooltip's target
        //      Tooltip's body
        //      Popover's overlay
        //      Popover's body
        //          Menu
        const shouldHideTooltip =
            e.relatedTarget instanceof HTMLElement &&
            e.currentTarget.parentElement &&
            e.currentTarget.parentElement.contains(e.relatedTarget);

        if (shouldHideTooltip) {
            // Hide the tooltip body
            if (contentRef.current) {
                contentRef.current.style.display = 'none';
            }
        } else {
            close();
        }
    };

    return (
        <>
            <div
                ref={targetRef}
                aria-describedby={`rpv-core__tooltip-body-${controlsSuffix}`}
                onBlur={onBlur}
                onFocus={open}
                onMouseEnter={open}
                onMouseLeave={close}
            >
                {target}
            </div>
            {opened && (
                <Portal offset={8} position={position} referenceRef={targetRef}>
                    {({ position: updatedPosition, ref }) => (
                        <TooltipBody
                            ariaControlsSuffix={controlsSuffix}
                            closeOnEscape={true}
                            position={updatedPosition}
                            ref={ref}
                            onClose={close}
                        >
                            {content()}
                        </TooltipBody>
                    )}
                </Portal>
            )}
        </>
    );
};
