/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { FC, RefObject, useEffect, useRef, useState } from 'react';
import { Store } from '@react-pdf-viewer/core';

import './selectionMode.less';
import SelectionMode from './SelectionMode';
import StoreProps from './StoreProps';

const Tracker: FC<{
    store: Store<StoreProps>,
}> = ({ store }) => {
    const pagesRef = useRef<HTMLDivElement | null>(null);
    const [selectionMode, setSelectionMode] = useState<SelectionMode>(SelectionMode.Text);
    const pos = useRef({ top: 0, left: 0, x: 0, y: 0 });

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
        if (!ele || selectionMode === SelectionMode.Text) {
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

    const handlePagesRef = (pagesRefFn: () => RefObject<HTMLDivElement>) => {
        pagesRef.current = pagesRefFn().current;
    };

    const handleSelectionModeChanged = (mode: SelectionMode) => {
        setSelectionMode(mode);
    };

    useEffect(() => {
        const ele = pagesRef.current;
        if (!ele) {
            return;
        }

        selectionMode === SelectionMode.Hand
            ? ele.classList.add('rpv-selection-mode-grab')
            : ele.classList.remove('rpv-selection-mode-grab');

        ele.addEventListener('mousedown', onMouseDownHandler);
        return (): void => {
            ele.removeEventListener('mousedown', onMouseDownHandler);
        };
    }, [selectionMode]);

    useEffect(() => {
        store.subscribe('getPagesRef', handlePagesRef);
        store.subscribe('selectionMode', handleSelectionModeChanged);

        return (): void => {
            store.unsubscribe('getPagesRef', handlePagesRef);
            store.unsubscribe('selectionMode', handleSelectionModeChanged);
        };
    }, []);

    return <></>;
};

export default Tracker;
