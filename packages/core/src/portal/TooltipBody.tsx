/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';
import { Position } from '../structs/Position';
import { TextDirection, ThemeContext } from '../theme/ThemeContext';
import { classNames } from '../utils/classNames';
import { Arrow } from './Arrow';
import { useEscapeStack } from './useEscapeStack';

export const TooltipBody = React.forwardRef<
    HTMLDivElement,
    {
        ariaControlsSuffix: string;
        children?: React.ReactNode;
        closeOnEscape: boolean;
        position: Position;
        onClose(): void;
    }
>((props, ref) => {
    const { ariaControlsSuffix, children, closeOnEscape, position, onClose } = props;
    const { direction } = React.useContext(ThemeContext);
    const isRtl = direction === TextDirection.RightToLeft;

    useEscapeStack(() => {
        if (closeOnEscape) {
            onClose();
        }
    });

    return (
        <div
            className={classNames({
                'rpv-core__tooltip-body': true,
                'rpv-core__tooltip-body--rtl': isRtl,
            })}
            id={`rpv-core__tooltip-body-${ariaControlsSuffix}`}
            ref={ref}
            role="tooltip"
        >
            <Arrow customClassName="rpv-core__tooltip-body-arrow" position={position} />
            <div className="rpv-core__tooltip-body-content">{children}</div>
        </div>
    );
});

TooltipBody.displayName = 'TooltipBody';
