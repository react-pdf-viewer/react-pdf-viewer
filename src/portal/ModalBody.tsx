/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import useKeyUp from '../hooks/useKeyUp';
import useLockScroll from '../hooks/useLockScroll';

interface ModalBodyProps {
    closeOnEscape: boolean;
    onToggle(): void;
}

const ModalBody: React.FC<ModalBodyProps> = ({ children, closeOnEscape, onToggle }) => {
    const contentRef = React.createRef<HTMLDivElement>();

    useLockScroll();
    useKeyUp(27, () => closeOnEscape && onToggle());

    return (
        <div
            ref={contentRef}
            style={{
                background: '#FFF',
                border: '1px solid rgba(0, 0, 0, 0.3)',
                borderRadius: '4px',
                margin: '160px auto 0 auto',
                maxWidth: '480px',
            }}
        >
            {children}
        </div>
    );
};

export default ModalBody;
