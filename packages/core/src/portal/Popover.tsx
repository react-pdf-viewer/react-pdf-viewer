/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { useToggle } from '../hooks/useToggle';
import { Position } from '../structs/Position';
import type { Offset } from '../types/Offset';
import { uniqueId } from '../utils/uniqueId';
import { PopoverBody } from './PopoverBody';
import { PopoverOverlay } from './PopoverOverlay';
import { RenderContent, RenderTarget } from './Portal';

export const Popover: React.FC<{
    ariaControlsSuffix?: string;
    ariaHasPopup?: 'dialog' | 'menu';
    closeOnClickOutside: boolean;
    closeOnEscape: boolean;
    content: RenderContent;
    lockScroll?: boolean;
    offset: Offset;
    position: Position;
    target: RenderTarget;
}> = ({
    ariaHasPopup = 'dialog',
    ariaControlsSuffix,
    closeOnClickOutside,
    closeOnEscape,
    content,
    lockScroll = true,
    offset,
    position,
    target,
}) => {
    const { opened, toggle } = useToggle(false);
    const targetRef = React.useRef<HTMLDivElement>();
    const controlsSuffix = React.useMemo(() => ariaControlsSuffix || `${uniqueId()}`, []);

    return (
        <div
            ref={targetRef}
            aria-expanded={opened ? 'true' : 'false'}
            aria-haspopup={ariaHasPopup}
            aria-controls={`rpv-core__popver-body-${controlsSuffix}`}
        >
            {target(toggle, opened)}

            {opened && (
                <>
                    {lockScroll && <PopoverOverlay closeOnEscape={closeOnEscape} onClose={toggle} />}
                    <PopoverBody
                        ariaControlsSuffix={controlsSuffix}
                        closeOnClickOutside={closeOnClickOutside}
                        offset={offset}
                        position={position}
                        targetRef={targetRef}
                        onClose={toggle}
                    >
                        {content(toggle)}
                    </PopoverBody>
                </>
            )}
        </div>
    );
};
