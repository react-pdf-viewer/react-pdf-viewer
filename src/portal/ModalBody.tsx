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
import ThemeContent from '../theme/ThemeContext';
import './modalBody.less';

interface ModalBodyProps {
    closeOnEscape: boolean;
    onToggle(): void;
}

const ModalBody: React.FC<ModalBodyProps> = ({ children, closeOnEscape, onToggle }) => {
    const theme = React.useContext(ThemeContent);
    const contentRef = React.createRef<HTMLDivElement>();

    useLockScroll();
    useKeyUp(27, () => closeOnEscape && onToggle());

    return (
        <div className={`${theme.prefixClass}-modal-body`} ref={contentRef}>
            {children}
        </div>
    );
};

export default ModalBody;
