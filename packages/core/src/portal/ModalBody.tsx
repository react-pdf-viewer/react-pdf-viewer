/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
import { useLockScroll } from '../hooks/useLockScroll';
import * as styles from '../styles/modalBody.module.css';
import { TextDirection, ThemeContext } from '../theme/ThemeContext';
import { classNames } from '../utils/classNames';
import { mergeRefs } from '../utils/mergeRefs';
import { useClickOutsideStack } from './useClickOutsideStack';
import { useEscapeStack } from './useEscapeStack';

export const ModalBody: React.FC<{
    ariaControlsSuffix: string;
    children?: React.ReactNode;
    closeOnClickOutside: boolean;
    closeOnEscape: boolean;
    onClose(): void;
}> = ({ ariaControlsSuffix, children, closeOnClickOutside, closeOnEscape, onClose }) => {
    const { direction } = React.useContext(ThemeContext);
    const isRtl = direction === TextDirection.RightToLeft;

    const contentRef = React.useRef<HTMLElement>();
    const [contentCallbackRef] = useClickOutsideStack(closeOnClickOutside, onClose);
    const mergedContentRef = mergeRefs([contentRef, contentCallbackRef]);

    useLockScroll();
    useEscapeStack(() => {
        if (closeOnEscape) {
            onClose();
        }
    });

    useIsomorphicLayoutEffect(() => {
        const contentEle = contentRef.current;
        if (!contentEle) {
            return;
        }

        // Limit the height of modal content
        const maxHeight = document.body.clientHeight * 0.75;
        if (contentEle.getBoundingClientRect().height >= maxHeight) {
            contentEle.style.overflow = 'auto';
            contentEle.style.maxHeight = `${maxHeight}px`;
        }
    }, []);

    return (
        <div
            aria-modal="true"
            className={classNames({
                [styles.body]: true,
                [styles.bodyRtl]: isRtl,
            })}
            id={`rpv-core__modal-body-${ariaControlsSuffix}`}
            ref={mergedContentRef}
            role="dialog"
            tabIndex={-1}
        >
            {children}
        </div>
    );
};
