/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

interface DropHook {
    isDragging: boolean;
}

const useDrop = (ref: React.RefObject<HTMLDivElement>, onDrop: (files: FileList) => void): DropHook => {
    const dragCount = React.useRef(0);
    const [isDragging, setDragging] = React.useState(false);

    const onDropHandler = (e: DragEvent): void => {
        e.preventDefault();
        setDragging(false);
        dragCount.current = 0;

        if (e.dataTransfer) {
            onDrop(e.dataTransfer.files);
        }
    };

    const onDragOverHandler = (e: DragEvent): void => {
        e.preventDefault();
    };

    const onDragEnterHandler = (e: DragEvent): void => {
        e.preventDefault();
        dragCount.current += 1;
        if (dragCount.current <= 1) {
            setDragging(true);
        }
    };

    const onDragLeaveHandler = (e: DragEvent): void => {
        e.preventDefault();
        dragCount.current -= 1;
        if (dragCount.current <= 0) {
            setDragging(false);
        }
    };

    React.useEffect(() => {
        const ele = ref.current;
        if (!ele) {
            return;
        }

        ele.addEventListener('drop', onDropHandler);
        ele.addEventListener('dragover', onDragOverHandler);
        ele.addEventListener('dragenter', onDragEnterHandler);
        ele.addEventListener('dragleave', onDragLeaveHandler);

        return (): void => {
            ele.removeEventListener('drop', onDropHandler);
            ele.removeEventListener('dragover', onDragOverHandler);
            ele.removeEventListener('dragenter', onDragEnterHandler);
            ele.removeEventListener('dragleave', onDragLeaveHandler);
        };
    }, [ref.current]);

    return { isDragging };
};

export default useDrop;
