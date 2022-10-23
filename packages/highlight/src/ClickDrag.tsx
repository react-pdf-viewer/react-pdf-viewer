/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { Store } from '@react-pdf-viewer/core';
import * as React from 'react';
import { getImageFromArea } from './getImageFromArea';
import { HighlightStateType } from './types/HighlightState';
import type { StoreProps } from './types/StoreProps';

interface Point {
    x: number;
    y: number;
}

export const ClickDrag: React.FC<{
    canvasLayerRef: React.MutableRefObject<HTMLCanvasElement>;
    canvasLayerRendered: boolean;
    pageIndex: number;
    store: Store<StoreProps>;
    textLayerRef: React.MutableRefObject<HTMLDivElement>;
    textLayerRendered: boolean;
}> = ({ canvasLayerRef, canvasLayerRendered, pageIndex, store, textLayerRef, textLayerRendered }) => {
    const containerRef = React.useRef<HTMLDivElement>();
    const currentCursorRef = React.useRef(document.body.style.cursor);
    const startPointRef = React.useRef<Point>({ x: 0, y: 0 });

    const handleMouseDown = (e: MouseEvent) => {
        const textLayerEle = textLayerRef.current;
        const container = containerRef.current;
        if (!e.altKey || !textLayerEle || !container) {
            return;
        }
        e.preventDefault();
        document.body.style.cursor = 'crosshair';
        const rect = textLayerEle.getBoundingClientRect();
        const startPoint = {
            x: e.clientX,
            y: e.clientY,
        };
        startPointRef.current = startPoint;

        container.style.top = `${((startPoint.y - rect.top) * 100) / rect.height}%`;
        container.style.left = `${((startPoint.x - rect.left) * 100) / rect.width}%`;
        container.style.height = '0px';
        container.style.width = '0px';

        // Attach the listeners to `document`
        document.addEventListener('mousemove', handleDocumentMouseMove);
        document.addEventListener('mouseup', handleDocumentMouseUp);
    };

    const handleDocumentMouseMove = (e: MouseEvent) => {
        const textLayerEle = textLayerRef.current;
        const container = containerRef.current;
        if (!textLayerEle || !container) {
            return;
        }
        e.preventDefault();

        // How far the mouse has been moved
        const endPoint = {
            x: e.clientX - startPointRef.current.x,
            y: e.clientY - startPointRef.current.y,
        };
        const rect = textLayerEle.getBoundingClientRect();

        if (container.classList.contains('rpv-highlight__click-drag--hidden')) {
            container.classList.remove('rpv-highlight__click-drag--hidden');
        }
        container.style.width = `${(endPoint.x * 100) / rect.width}%`;
        container.style.height = `${(endPoint.y * 100) / rect.height}%`;
    };

    const handleDocumentMouseUp = () => {
        document.removeEventListener('mousemove', handleDocumentMouseMove);
        document.removeEventListener('mouseup', handleDocumentMouseUp);

        resetCursor();

        const container = containerRef.current;
        const canvasEle = canvasLayerRef.current;
        if (!container || !canvasEle) {
            return;
        }
        const highlightArea = {
            pageIndex,
            top: parseFloat(container.style.top.slice(0, -1)),
            left: parseFloat(container.style.left.slice(0, -1)),
            height: parseFloat(container.style.height.slice(0, -1)),
            width: parseFloat(container.style.width.slice(0, -1)),
        };
        const previewImage = getImageFromArea()(canvasEle, highlightArea);
        const newState = {
            highlightAreas: [highlightArea],
            previewImage,
            selectionRegion: highlightArea,
            type: HighlightStateType.ClickDragged,
        };
        store.update('highlightState', newState);
    };

    // Reset the cursor
    const resetCursor = () => {
        currentCursorRef.current
            ? (document.body.style.cursor = currentCursorRef.current)
            : document.body.style.removeProperty('cursor');
    };

    React.useEffect(() => {
        const canvasEle = canvasLayerRef.current;
        const textLayerEle = textLayerRef.current;
        if (!canvasLayerRendered || !textLayerRendered || !canvasEle || !textLayerEle) {
            return;
        }
        textLayerEle.addEventListener('mousedown', handleMouseDown);
        return () => {
            textLayerEle.removeEventListener('mousedown', handleMouseDown);
        };
    }, [textLayerRendered]);

    return <div ref={containerRef} className="rpv-highlight__click-drag rpv-highlight__click-drag--hidden" />;
};
