/**
 * A React component to view a PDF document
 * 
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

interface ModalOverlayProps {
    closeOnClickOutside: boolean;
    onClose(): void;
}

const ModalOverlay: React.FC<ModalOverlayProps> = ({ children, closeOnClickOutside, onClose }) => {
    const onClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && closeOnClickOutside) {
            onClose();
        }
    };

    return (
        <div
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                bottom: 0,
                left: 0,
                position: 'fixed',
                right: 0,
                top: 0,
                zIndex: 9999,
            }}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default ModalOverlay;
