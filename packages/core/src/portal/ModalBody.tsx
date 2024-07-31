/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';
import { useLockScroll } from '../hooks/useLockScroll';
import styles from '../styles/modalBody.module.css';
import { TextDirection, ThemeContext } from '../theme/ThemeContext';
import type { Toggle } from '../types/Toggle';
import { classNames } from '../utils/classNames';
import { mergeRefs } from '../utils/mergeRefs';
import { useClickOutsideStack } from './useClickOutsideStack';
import { useEscapeStack } from './useEscapeStack';

type RenderChildrenProps = ({ onClose }: { onClose: Toggle }) => React.ReactNode;

export const ModalBody: React.FC<{
    ariaControlsSuffix: string;
    children: RenderChildrenProps;
    closeOnClickOutside: boolean;
    closeOnEscape: boolean;
    onClose: Toggle;
}> = ({ ariaControlsSuffix, children, closeOnClickOutside, closeOnEscape, onClose }) => {
    const { direction } = React.useContext(ThemeContext);
    const isRtl = direction === TextDirection.RightToLeft;

    const overlayRef = React.useRef<HTMLDivElement>(null);
    const contentRef = React.useRef<HTMLElement>();

    const animationOptions: KeyframeAnimationOptions = {
        duration: 150,
        fill: 'forwards',
    };

    const handleClose = () => {
        const overlayEle = overlayRef.current;
        const contentEle = contentRef.current;
        if (!overlayEle || !contentEle) {
            return;
        }

        // Scale out the body
        contentEle.animate(
            [
                {
                    opacity: 1,
                    transform: 'scale(1)',
                },
                {
                    opacity: 0,
                    transform: 'scale(0.9)',
                },
            ],
            animationOptions,
        );

        // Fade out the overlay
        const overlayAnimation = overlayEle.animate(
            [
                {
                    background: 'rgba(0, 0, 0, 0.8)',
                    opacity: 1,
                },
                {
                    background: 'rgba(0, 0, 0, 1)',
                    opacity: 0,
                },
            ],
            animationOptions,
        );
        overlayAnimation.finished.then(() => {
            onClose();
        });
    };

    const [contentCallbackRef] = useClickOutsideStack(closeOnClickOutside, handleClose);
    const mergedContentRef = mergeRefs([contentRef, contentCallbackRef]);

    useLockScroll();
    useEscapeStack(() => {
        if (closeOnEscape) {
            handleClose();
        }
    });

    React.useEffect(() => {
        const overlayEle = overlayRef.current;
        const contentEle = contentRef.current;
        if (!overlayEle || !contentEle) {
            return;
        }
        // Fade in the overlay
        const overlayAnimation = overlayEle.animate(
            [
                {
                    background: 'rgba(0, 0, 0, 1)',
                    opacity: 0,
                },
                {
                    background: 'rgba(0, 0, 0, 0.8)',
                    opacity: 1,
                },
            ],
            animationOptions,
        );
        // Scale the modal content
        const contentAnimation = contentEle.animate(
            [
                {
                    opacity: 0,
                    transform: 'scale(0.9)',
                },
                {
                    opacity: 1,
                    transform: 'scale(1)',
                },
            ],
            animationOptions,
        );

        return () => {
            overlayAnimation.cancel();
            contentAnimation.cancel();
        };
    }, []);

    React.useEffect(() => {
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
        <div className={styles.overlay} ref={overlayRef}>
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
                {children({ onClose: handleClose })}
            </div>
        </div>
    );
};
