/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { type Store } from '@react-pdf-viewer/core';
import * as React from 'react';
import { SelectionMode } from './structs/SelectionMode';
import { type StoreProps } from './types/StoreProps';

export const Tracker: React.FC<{
    store: Store<StoreProps>;
}> = ({ store }) => {
    const pagesRef = React.useRef<HTMLElement | null>(null);
    const [selectionMode, setSelectionMode] = React.useState<SelectionMode>(SelectionMode.Text);
    const pos = React.useRef({ top: 0, left: 0, x: 0, y: 0 });

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

        ele.classList.add('rpv-selection-mode__grab');
        ele.classList.remove('rpv-selection-mode__grabbing');

        document.removeEventListener('mousemove', onMouseMoveHandler);
        document.removeEventListener('mouseup', onMouseUpHandler);
    };

    const onMouseDownHandler = (e: MouseEvent): void => {
        const ele = pagesRef.current;
        if (!ele || selectionMode === SelectionMode.Text) {
            return;
        }

        ele.classList.remove('rpv-selection-mode__grab');
        ele.classList.add('rpv-selection-mode__grabbing');

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

    const handlePagesContainer = (getPagesContainer: () => HTMLElement) => {
        pagesRef.current = getPagesContainer();
    };

    const handleSelectionModeChanged = (mode: SelectionMode) => {
        setSelectionMode(mode);
    };

    React.useEffect(() => {
        const ele = pagesRef.current;
        if (!ele) {
            return;
        }

        selectionMode === SelectionMode.Hand
            ? ele.classList.add('rpv-selection-mode__grab')
            : ele.classList.remove('rpv-selection-mode__grab');

        ele.addEventListener('mousedown', onMouseDownHandler);
        return (): void => {
            ele.removeEventListener('mousedown', onMouseDownHandler);
        };
    }, [selectionMode]);

    React.useEffect(() => {
        store.subscribe('getPagesContainer', handlePagesContainer);
        store.subscribe('selectionMode', handleSelectionModeChanged);

        return (): void => {
            store.unsubscribe('getPagesContainer', handlePagesContainer);
            store.unsubscribe('selectionMode', handleSelectionModeChanged);
        };
    }, []);

    return <></>;
};
