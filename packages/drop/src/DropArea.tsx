/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { FC, useContext, RefObject } from 'react';
import { LocalizationContext } from '@react-pdf-viewer/core';

import './dropArea.less';
import useDrop from './useDrop';

interface DropAreaProps {
    containerRef: RefObject<HTMLDivElement>;
    openFile(file: File): void;
}

const DropArea: FC<DropAreaProps> = ({ containerRef, openFile }) => {
    const { isDragging } = useDrop(containerRef, (files) => {
        if (files.length === 0) {
            return;
        }
        openFile(files[0]);
    });
    const l10nContext = useContext(LocalizationContext);

    return (
        <>
        {isDragging && (
            <div className='rpv-drop-area'>
                {
                    (l10nContext && l10nContext.plugins && l10nContext.plugins.drop)
                        ? l10nContext.plugins.drop.dragDropFile
                        : 'Drag and drop a PDF document here'
                }
            </div>
        )}
        </>
    );
};

export default DropArea;
