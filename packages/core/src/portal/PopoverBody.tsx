/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';
import { useClickOutside } from '../hooks/useClickOutside';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
import { Position } from '../structs/Position';
import { TextDirection, ThemeContext } from '../theme/ThemeContext';
import { type Offset } from '../types/Offset';
import { classNames } from '../utils/classNames';
import { Arrow } from './Arrow';

export const PopoverBody = React.forwardRef<
    HTMLDivElement,
    {
        ariaControlsSuffix: string;
        children?: React.ReactNode;
        closeOnClickOutside: boolean;
        offset: Offset;
        position: Position;
        onClose(): void;
    }
>((props, ref) => {
    const { ariaControlsSuffix, children, closeOnClickOutside, offset, position, onClose } = props;

    const contentRef = React.useRef<HTMLDivElement>();
    const innerRef = React.useRef<HTMLDivElement>();
    const { direction } = React.useContext(ThemeContext);
    const isRtl = direction === TextDirection.RightToLeft;

    useClickOutside(closeOnClickOutside, contentRef, onClose);

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

    const innerId = `rpv-core__popover-body-inner-${ariaControlsSuffix}`;

    return (
        <div
            aria-describedby={innerId}
            className={classNames({
                'rpv-core__popover-body': true,
                'rpv-core__popover-body--rtl': isRtl,
            })}
            id={`rpv-core__popover-body-${ariaControlsSuffix}`}
            ref={ref}
            role="dialog"
            tabIndex={-1}
        >
            <Arrow customClassName="rpv-core__popover-body-arrow" position={position} />
            <div id={innerId} ref={innerRef}>
                {children}
            </div>
        </div>
    );
});

PopoverBody.displayName = 'PopoverBody';
