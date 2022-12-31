/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { Store } from '@react-pdf-viewer/core';
import * as React from 'react';
import { getImageFromArea } from './getImageFromArea';
import { HighlightState, HighlightStateType, NO_SELECTION_STATE } from './types/HighlightState';
import type { StoreProps } from './types/StoreProps';

interface Point {
    x: number;
    y: number;
}
interface Offset {
    top: number;
    left: number;
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
    const offsetRef = React.useRef<Offset>({ top: 0, left: 0 });

    const hideContainer = () => {
        const container = containerRef.current;
        if (container) {
            container.classList.add('rpv-highlight__click-drag--hidden');
        }
    };

    const handleMouseDown = (e: MouseEvent) => {
        const textLayerEle = textLayerRef.current;
        const container = containerRef.current;
        if (!e.altKey || !textLayerEle || !container || e.button !== 0) {
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

        const offset = {
            top: ((startPoint.y - rect.top) * 100) / rect.height,
            left: ((startPoint.x - rect.left) * 100) / rect.width,
        };
        offsetRef.current = offset;

        container.style.top = `${offset.top}%`;
        container.style.left = `${offset.left}%`;
        container.style.height = '0px';
        container.style.width = '0px';

        // Attach the listeners to `document`
        document.addEventListener('mousemove', handleDocumentMouseMove);
        document.addEventListener('mouseup', handleDocumentMouseUp);

        store.updateCurrentValue('highlightState', (currentState) =>
            Object.assign({}, currentState, { type: HighlightStateType.ClickDragging })
        );
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

        // Prevent users from dragging out of the page
        const width = Math.min(100 - offsetRef.current.left, (endPoint.x * 100) / rect.width);
        const height = Math.min(100 - offsetRef.current.top, (endPoint.y * 100) / rect.height);

        container.style.width = `${width}%`;
        container.style.height = `${height}%`;
    };

    const handleDocumentKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && store.get('highlightState').type === HighlightStateType.ClickDragged) {
            e.preventDefault();
            hideContainer();
            store.update('highlightState', NO_SELECTION_STATE);
        }
    };

    // Hide the container when clicking outside
    const handleDocumenClick = (e: MouseEvent) => {
        const container = containerRef.current;
        if (!container) {
            return;
        }
        const highlightType = store.get('highlightState').type;
        if (highlightType === HighlightStateType.NoSelection && e.target !== container) {
            hideContainer();
        }
    };

    const handleDocumentMouseUp = (e: MouseEvent) => {
        e.preventDefault();
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

    const handleHighlightState = (s: HighlightState) => {
        if (
            s.type === HighlightStateType.Selection ||
            // User is dragging in other page
            (s.type === HighlightStateType.ClickDragging && s.selectionRegion.pageIndex !== pageIndex)
        ) {
            hideContainer();
        }
    };

    React.useEffect(() => {
        store.subscribe('highlightState', handleHighlightState);

        return (): void => {
            store.unsubscribe('highlightState', handleHighlightState);
        };
    }, []);

    React.useEffect(() => {
        const canvasEle = canvasLayerRef.current;
        const textLayerEle = textLayerRef.current;
        if (!canvasLayerRendered || !textLayerRendered || !canvasEle || !textLayerEle) {
            return;
        }
        textLayerEle.addEventListener('mousedown', handleMouseDown);
        const eventOptions = {
            capture: true,
        };
        document.addEventListener('keydown', handleDocumentKeyDown);
        document.addEventListener('click', handleDocumenClick, eventOptions);
        return () => {
            textLayerEle.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('click', handleDocumenClick, eventOptions);
            document.removeEventListener('keydown', handleDocumentKeyDown);
        };
    }, [textLayerRendered]);

    return <div ref={containerRef} className="rpv-highlight__click-drag rpv-highlight__click-drag--hidden" />;
};
