/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

interface Point {
    x: number;
    y: number;
}

export const ClickDrag: React.FC<{
    textLayerRef: React.MutableRefObject<HTMLDivElement>;
    textLayerRendered: boolean;
}> = ({
    textLayerRef, textLayerRendered
}) => {
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

        container.style.top = `${startPoint.y - rect.top}px`;
        container.style.left = `${startPoint.x - rect.left}px`;

        // Attach the listeners to `document`
        document.addEventListener('mousemove', handleDocumentMouseMove);
        document.addEventListener('mouseup', handleDocumentMouseUp);
    };

    const handleDocumentMouseMove = (e: MouseEvent) => {
        const container = containerRef.current;
        if (!container) {
            return;
        }
        e.preventDefault();

        // How far the mouse has been moved
        const endPoint = {
            x: e.clientX - startPointRef.current.x,
            y: e.clientY - startPointRef.current.y,
        };

        container.style.width = `${endPoint.x}px`;
        container.style.height = `${endPoint.y}px`;
    };

    const handleDocumentMouseUp = () => {
        document.removeEventListener('mousemove', handleDocumentMouseMove);
        document.removeEventListener('mouseup', handleDocumentMouseUp);

        resetCursor();
    };

    // Reset the cursor
    const resetCursor = () => {
        currentCursorRef.current
            ? (document.body.style.cursor = currentCursorRef.current)
            : document.body.style.removeProperty('cursor');
    }

    React.useEffect(() => {
        const textLayerEle = textLayerRef.current;
        if (!textLayerRendered || !textLayerEle) {
            return;
        }
        textLayerEle.addEventListener('mousedown', handleMouseDown);
        return () => {
            textLayerEle.removeEventListener('mousedown', handleMouseDown);
        };
    }, [textLayerRendered]);

    return (
        <div ref={containerRef} className="rpv-highlight__click-drag" />
    );
};
