/**
 * A React component to view a PDF document
 * 
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

interface PopoverOverlayProps {
    closeOnClickOutside: boolean;
    onClose(): void;
}

const PopoverOverlay: React.FC<PopoverOverlayProps> = ({ children, closeOnClickOutside, onClose }) => {
    const onClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && closeOnClickOutside) {
            onClose();
        }
    };

    React.useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).position;
        if (closeOnClickOutside) {
            document.body.style.position = 'relative';
        }

        return () => {
            document.body.style.setProperty('overflow', originalStyle);
        };
    }, [closeOnClickOutside]);

    return (
        closeOnClickOutside
        ? (
            <div
                style={{
                    bottom: '0',
                    left: '0',
                    position: 'absolute',
                    right: '0',
                    top: '0',
                }}
                onClick={onClick}
            >
                {children}
            </div>
        )
        : <>{children}</>
    );
};

export default PopoverOverlay;
