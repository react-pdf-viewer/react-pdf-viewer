/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';
import { useToggle } from '../hooks/useToggle';
import { Position } from '../structs/Position';
import type { Toggle } from '../types/Toggle';
import { uniqueId } from '../utils/uniqueId';
import { PopoverBody } from './PopoverBody';
import { PopoverOverlay } from './PopoverOverlay';
import { Portal } from './Portal';

export type RenderContent = (toggle: Toggle) => React.ReactNode;
export type RenderTarget = (toggle: Toggle, opened: boolean) => React.ReactNode;

export const Popover: React.FC<{
    ariaControlsSuffix?: string;
    ariaHasPopup?: 'dialog' | 'menu';
    closeOnClickOutside: boolean;
    closeOnEscape: boolean;
    content: RenderContent;
    lockScroll?: boolean;
    position: Position;
    target: RenderTarget;
}> = ({
    ariaHasPopup = 'dialog',
    ariaControlsSuffix,
    closeOnClickOutside,
    closeOnEscape,
    content,
    lockScroll = true,
    position,
    target,
}) => {
    const { opened, toggle } = useToggle(false);
    const targetRef = React.useRef<HTMLDivElement>(null);
    const controlsSuffix = React.useMemo(() => ariaControlsSuffix || `${uniqueId()}`, []);

    return (
        <>
            <div
                ref={targetRef}
                aria-expanded={opened ? 'true' : 'false'}
                aria-haspopup={ariaHasPopup}
                aria-controls={`rpv-core__popver-body-${controlsSuffix}`}
            >
                {target(toggle, opened)}
            </div>
            {opened && (
                <Portal offset={8} position={position} referenceRef={targetRef}>
                    {({ position: updatedPosition, ref }) => {
                        const popoverBody = (
                            <PopoverBody
                                ariaControlsSuffix={controlsSuffix}
                                closeOnClickOutside={closeOnClickOutside}
                                position={updatedPosition}
                                ref={ref}
                                onClose={toggle}
                            >
                                {content(toggle)}
                            </PopoverBody>
                        );
                        return lockScroll ? (
                            <PopoverOverlay closeOnEscape={closeOnEscape} onClose={toggle}>
                                {popoverBody}
                            </PopoverOverlay>
                        ) : (
                            popoverBody
                        );
                    }}
                </Portal>
            )}
        </>
    );
};
