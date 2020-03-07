/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import ThemeContent from '../theme/ThemeContext';
import './dragScroll.less';

interface DragScrollHook {
    toggleDragScroll(enabled: boolean): void;
}

const useDragScroll = (ref: React.RefObject<HTMLDivElement>): DragScrollHook => {
    const theme = React.useContext(ThemeContent);
    const [enabled, setEnabled] = React.useState(false);
    const pos = React.useRef({ top: 0, left: 0, x: 0, y: 0 });

    const onMouseMoveHandler = (e: MouseEvent): void => {
        const ele = ref.current;
        if (!ele) {
            return;
        }
        ele.scrollTop = pos.current.top - (e.clientY - pos.current.y);
        ele.scrollLeft = pos.current.left - (e.clientX - pos.current.x);
    };

    const onMouseUpHandler = (): void => {
        const ele = ref.current;
        if (!ele) {
            return;
        }
        ele.classList.add(`${theme.prefixClass}-grab`);
        ele.classList.remove(`${theme.prefixClass}-grabbing`);

        document.removeEventListener('mousemove', onMouseMoveHandler);
        document.removeEventListener('mouseup', onMouseUpHandler);
    };

    const onMouseDownHandler = (e: MouseEvent): void => {
        const ele = ref.current;
        if (!enabled || !ele) {
            return;
        }

        ele.classList.remove(`${theme.prefixClass}-grab`);
        ele.classList.add(`${theme.prefixClass}-grabbing`);

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

    React.useEffect(() => {
        const ele = ref.current;
        if (!ele) {
            return;
        }
        enabled
            ? ele.classList.add(`${theme.prefixClass}-grab`)
            : ele.classList.remove(`${theme.prefixClass}-grab`);
        ele.addEventListener('mousedown', onMouseDownHandler);

        return (): void => {
            ele.removeEventListener('mousedown', onMouseDownHandler);
        };
    }, [enabled]);

    return {
        toggleDragScroll: setEnabled,
    };
};

export default useDragScroll;
