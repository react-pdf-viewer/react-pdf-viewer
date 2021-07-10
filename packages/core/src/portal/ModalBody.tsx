/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import useClickOutside from '../hooks/useClickOutside';
import useIsomorphicLayoutEffect from '../hooks/useIsomorphicLayoutEffect';
import useKeyUp from '../hooks/useKeyUp';
import useLockScroll from '../hooks/useLockScroll';

interface ModalBodyProps {
    ariaControlsSuffix: string;
    closeOnClickOutside: boolean;
    closeOnEscape: boolean;
    onToggle(): void;
}

const ModalBody: React.FC<ModalBodyProps> = ({
    ariaControlsSuffix,
    children,
    closeOnClickOutside,
    closeOnEscape,
    onToggle,
}) => {
    const contentRef = React.useRef<HTMLDivElement>();

    useLockScroll();
    useKeyUp(27, () => closeOnEscape && onToggle());
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
            className="rpv-core__modal-body"
            id={`rpv-core__modal-body-${ariaControlsSuffix}`}
            ref={contentRef}
            role="dialog"
            tabIndex={-1}
        >
            {children}
        </div>
    );
};

export default ModalBody;
