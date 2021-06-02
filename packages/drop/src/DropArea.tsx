/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { LocalizationContext } from '@react-pdf-viewer/core';

import useDrop from './useDrop';

interface DropAreaProps {
    containerRef: React.RefObject<HTMLDivElement>;
    openFile(file: File): void;
}

const DropArea: React.FC<DropAreaProps> = ({ containerRef, openFile }) => {
    const { isDragging } = useDrop(containerRef, (files) => {
        if (files.length === 0) {
            return;
        }
        openFile(files[0]);
    });
    const l10n = React.useContext(LocalizationContext);

    return (
        <>
        {isDragging && (
            <div className='rpv-drop__area'>
                <div className='rpv-drop__area-body'>
                {
                    l10n && l10n.drop ? l10n.drop.dragDropFile : 'Drag and drop a PDF document here'
                }
                </div>
            </div>
        )}
        </>
    );
};

export default DropArea;
