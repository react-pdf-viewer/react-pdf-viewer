/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { RefObject, useEffect, useRef, useState } from 'react';
import { Store, StoreHandler } from '@phuocng/rpv';

import './dragScroll.less';
import SelectionMode from './SelectionMode';
import StoreProps from './StoreProps';

interface DragScrollHook {
    selectionMode: SelectionMode;
    switchSelectionMode(selectionMode: SelectionMode): void;
}

const useDragScroll = (store: Store<StoreProps>): DragScrollHook => {
    const pagesRef = useRef<HTMLDivElement | null>(null);
    const [selectionMode, setSelectionMode] = useState<SelectionMode>(store.get('selectionMode') || SelectionMode.Text);
    const pos = useRef({ top: 0, left: 0, x: 0, y: 0 });

    const switchSelectionMode = (mode: SelectionMode) => {
        store.update('selectionMode', mode);
        setSelectionMode(mode);
    };

    const onMouseMoveHandler = (e: MouseEvent): void => {
        const ele = pagesRef.current;
        if (!ele) {
            return;
        }
        ele.scrollTop = pos.current.top - (e.clientY - pos.current.y);
        ele.scrollLeft = pos.current.left - (e.clientX - pos.current.x);
    };

    const onMouseUpHandler = (): void => {
        const ele = pagesRef.current;
        if (!ele) {
            return;
        }
        ele.classList.add('rpv-selection-mode-grab');
        ele.classList.remove('rpv-selection-mode-grabbing');

        document.removeEventListener('mousemove', onMouseMoveHandler);
        document.removeEventListener('mouseup', onMouseUpHandler);
    };

    const onMouseDownHandler = (e: MouseEvent): void => {
        const ele = pagesRef.current;
        if (selectionMode === SelectionMode.Text || !ele) {
            return;
        }

        ele.classList.remove('rpv-selection-mode-grab');
        ele.classList.add('rpv-selection-mode-grabbing');

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

    useEffect(() => {
        const ele = pagesRef.current;
        if (!ele) {
            return;
        }

        selectionMode === SelectionMode.Text
            ? ele.classList.add('rpv-selection-mode-grab')
            : ele.classList.remove('rpv-selection-mode-grab');
        ele.addEventListener('mousedown', onMouseDownHandler);

        return (): void => {
            ele.removeEventListener('mousedown', onMouseDownHandler);
        };
    }, [selectionMode]);

    const handlePagesRef = (pagesRefFn: () => RefObject<HTMLDivElement>) => {
        pagesRef.current = pagesRefFn().current;
    };

    useEffect(() => {
        store.subscribe('getPagesRef', handlePagesRef);
        return (): void => {
            store.unsubscribe('getPagesRef', handlePagesRef);
        };
    }, []);

    return {
        selectionMode,
        switchSelectionMode,
    };
};

export default useDragScroll;
