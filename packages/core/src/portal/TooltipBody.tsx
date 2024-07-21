/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';
import { Position } from '../structs/Position';
import styles from '../styles/tooltipBody.module.css';
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
                [styles.body]: true,
                [styles.bodyRtl]: isRtl,
            })}
            id={`rpv-core__tooltip-body-${ariaControlsSuffix}`}
            ref={ref}
            role="tooltip"
        >
            <Arrow customClassName={styles.arrow} position={position} />
            <div className={styles.content}>{children}</div>
        </div>
    );
});

TooltipBody.displayName = 'TooltipBody';
