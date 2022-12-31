/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { useClickOutside } from '../hooks/useClickOutside';
import { useEscape } from '../hooks/useEscape';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
import { useLockScroll } from '../hooks/useLockScroll';
import { TextDirection, ThemeContext } from '../theme/ThemeContext';
import { classNames } from '../utils/classNames';

export const ModalBody: React.FC<{
    ariaControlsSuffix: string;
    children?: React.ReactNode;
    closeOnClickOutside: boolean;
    closeOnEscape: boolean;
    onToggle(): void;
}> = ({ ariaControlsSuffix, children, closeOnClickOutside, closeOnEscape, onToggle }) => {
    const contentRef = React.useRef<HTMLDivElement>();
    const { direction } = React.useContext(ThemeContext);
    const isRtl = direction === TextDirection.RightToLeft;

    useLockScroll();
    useEscape(() => {
        if (contentRef.current && closeOnEscape) {
            onToggle();
        }
    });
    useClickOutside(closeOnClickOutside, contentRef, onToggle);

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
                'rpv-core__modal-body': true,
                'rpv-core__modal-body--rtl': isRtl,
            })}
            id={`rpv-core__modal-body-${ariaControlsSuffix}`}
            ref={contentRef}
            role="dialog"
            tabIndex={-1}
        >
            {children}
        </div>
    );
};
