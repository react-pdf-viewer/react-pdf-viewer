/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { createRef, useContext } from 'react';

import useClickOutside from '../hooks/useClickOutside';
import useKeyUp from '../hooks/useKeyUp';
import useLockScroll from '../hooks/useLockScroll';
import ThemeContext from '../theme/ThemeContext';
import './modalBody.less';

interface ModalBodyProps {
    closeOnClickOutside: boolean;
    closeOnEscape: boolean;
    onToggle(): void;
}

const ModalBody: React.FC<ModalBodyProps> = ({ children, closeOnClickOutside, closeOnEscape, onToggle }) => {
    const theme = useContext(ThemeContext);
    const contentRef = createRef<HTMLDivElement>();

    useLockScroll();
    useKeyUp(27, () => closeOnEscape && onToggle());
    useClickOutside(closeOnClickOutside, contentRef, onToggle);

    return (
        <div className={`${theme.prefixClass}-modal-body`} ref={contentRef}>
            {children}
        </div>
    );
};

export default ModalBody;
