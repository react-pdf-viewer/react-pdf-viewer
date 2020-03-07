/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import ThemeContent from '../theme/ThemeContext';
import './modalOverlay.less';

interface ModalOverlayProps {
    closeOnClickOutside: boolean;
    onClose(): void;
}

const ModalOverlay: React.FC<ModalOverlayProps> = ({ children, closeOnClickOutside, onClose }) => {
    const theme = React.useContext(ThemeContent);

    const onClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && closeOnClickOutside) {
            onClose();
        }
    };

    return (
        <div className={`${theme.prefixClass}-modal-overlay`} onClick={onClick}>
            {children}
        </div>
    );
};

export default ModalOverlay;
