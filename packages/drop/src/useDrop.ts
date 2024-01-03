/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';

export const useDrop = (
    ref: React.RefObject<HTMLDivElement>,
    onDrop: (files: FileList) => void,
): {
    isDragging: boolean;
} => {
    const dragCount = React.useRef(0);
    const [isDragging, setDragging] = React.useState(false);

    const [element, setElement] = React.useState(ref.current);

    React.useEffect(() => {
        if (ref.current !== element) {
            setElement(ref.current);
        }
    }, []);

    const handleDrop = (e: DragEvent): void => {
        e.preventDefault();
        setDragging(false);
        dragCount.current = 0;

        if (e.dataTransfer) {
            onDrop(e.dataTransfer.files);
        }
    };

    const handleDragOver = (e: DragEvent): void => {
        e.preventDefault();
    };

    const handleDragEnter = (e: DragEvent): void => {
        e.preventDefault();
        dragCount.current += 1;
        if (dragCount.current <= 1) {
            setDragging(true);
        }
    };

    const handleDragLeave = (e: DragEvent): void => {
        e.preventDefault();
        dragCount.current -= 1;
        if (dragCount.current <= 0) {
            setDragging(false);
        }
    };

    React.useEffect(() => {
        if (!element) {
            return;
        }

        element.addEventListener('drop', handleDrop);
        element.addEventListener('dragover', handleDragOver);
        element.addEventListener('dragenter', handleDragEnter);
        element.addEventListener('dragleave', handleDragLeave);

        return (): void => {
            element.removeEventListener('drop', handleDrop);
            element.removeEventListener('dragover', handleDragOver);
            element.removeEventListener('dragenter', handleDragEnter);
            element.removeEventListener('dragleave', handleDragLeave);
        };
    }, [element]);

    return { isDragging };
};
