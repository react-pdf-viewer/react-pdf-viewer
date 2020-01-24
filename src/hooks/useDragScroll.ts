/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import './dragScroll.css';

const GRAB_CLASS = 'viewer-grab';
const GRABBING_CLASS = 'viewer-grabbing';

interface DragScrollHook {
    toggleDragScroll(enabled: boolean): void;
}

const useDragScroll = (ref: React.RefObject<HTMLDivElement>): DragScrollHook => {
    const [enabled, setEnabled] = React.useState(false);
    const pos = React.useRef({ top: 0, left: 0, x: 0, y: 0 });

    const onMouseDownHandler = (e: MouseEvent) => {
        const ele = ref.current;
        if (!enabled || !ele) {
            return;
        }

        ele.classList.remove(GRAB_CLASS);
        ele.classList.add(GRABBING_CLASS);

        e.preventDefault();
        e.stopPropagation();

        pos.current = {
            left: ele.scrollLeft,
            top: ele.scrollTop,
            x: e.clientX,
            y: e.clientY,
        };

        document.addEventListener('mousemove', onMouseMoveHandler);
        document.addEventListener('mouseup', onMouseUpHandler);
    };

    const onMouseMoveHandler = (e: MouseEvent) => {
        const ele = ref.current;
        if (!ele) {
            return;
        }
        ele.scrollTop = pos.current.top - (e.clientY - pos.current.y);
        ele.scrollLeft = pos.current.left - (e.clientX - pos.current.x);
    };

    const onMouseUpHandler = () => {
        const ele = ref.current;
        if (!ele) {
            return;
        }
        ele.classList.add(GRAB_CLASS);
        ele.classList.remove(GRABBING_CLASS);

        document.removeEventListener('mousemove', onMouseMoveHandler);
        document.removeEventListener('mouseup', onMouseUpHandler);
    };

    React.useEffect(() => {
        const ele = ref.current;
        if (!ele) {
            return;
        }
        enabled
            ? ele.classList.add(GRAB_CLASS)
            : ele.classList.remove(GRAB_CLASS);
        ele.addEventListener('mousedown', onMouseDownHandler);

        return () => {
            ele.removeEventListener('mousedown', onMouseDownHandler);
        };
    }, [enabled]);

    return {
        toggleDragScroll: setEnabled,
    };
};

export default useDragScroll;
