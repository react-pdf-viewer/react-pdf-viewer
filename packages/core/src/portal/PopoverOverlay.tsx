/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import useEscape from '../hooks/useEscape';

interface PopoverOverlayProps {
    closeOnEscape: boolean;
    onClose(): void;
}

const PopoverOverlay: React.FC<PopoverOverlayProps> = ({ closeOnEscape, onClose }) => {
    useEscape(() => closeOnEscape && onClose());

    return <div className="rpv-core__popover-overlay" />;
};

export default PopoverOverlay;
