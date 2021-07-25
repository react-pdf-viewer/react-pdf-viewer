/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import { useEscape } from '../hooks/useEscape';

export const PopoverOverlay: React.FC<{
    closeOnEscape: boolean;
    onClose(): void;
}> = ({ closeOnEscape, onClose }) => {
    useEscape(() => closeOnEscape && onClose());

    return <div className="rpv-core__popover-overlay" />;
};
