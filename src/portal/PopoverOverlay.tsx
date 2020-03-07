/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import ThemeContent from '../theme/ThemeContext';
import './popoverOverlay.less';

interface PopoverOverlayProps {
    closeOnClickOutside: boolean;
    onClose(): void;
}

const PopoverOverlay: React.FC<PopoverOverlayProps> = ({ children, closeOnClickOutside, onClose }) => {
    const theme = React.useContext(ThemeContent);

    const onClick = (e: React.MouseEvent): void => {
        if (e.target === e.currentTarget && closeOnClickOutside) {
            onClose();
        }
    };

    React.useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).position;
        if (closeOnClickOutside) {
            document.body.style.position = 'relative';
        }

        return (): void => {
            document.body.style.setProperty('overflow', originalStyle);
        };
    }, [closeOnClickOutside]);

    return (
        closeOnClickOutside
        ? (
            <div className={`${theme.prefixClass}-popover-overlay`} onClick={onClick}>
                {children}
            </div>
        )
        : <>{children}</>
    );
};

export default PopoverOverlay;
