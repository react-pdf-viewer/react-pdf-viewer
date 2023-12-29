/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useAnimationFrame } from '../hooks/useAnimationFrame';
import { Position } from '../structs/Position';
import { determineBestPosition } from '../utils/determineBestPosition';

const EMPTY_DOM_RECT = new DOMRect();

const areRectsEqual = (a: DOMRect, b: DOMRect) =>
    ['top', 'left', 'width', 'height'].every((key) => a[key as keyof DOMRect] === b[key as keyof DOMRect]);

export const Portal: React.FC<{
    children: ({ ref }: { ref: React.RefCallback<HTMLElement> }) => React.ReactNode;
    offset?: number;
    position: Position;
    referenceRef: React.MutableRefObject<HTMLElement>;
}> = ({ children, offset = 0, position, referenceRef }) => {
    const [ele, setEle] = React.useState<HTMLElement>();

    const targetRef = React.useCallback((ele: HTMLElement) => {
        setEle(ele);
    }, []);

    const prevBoundingRectsRef = React.useRef<DOMRect[]>([]);
    const [start] = useAnimationFrame(
        () => {
            if (!ele || !referenceRef.current) {
                return;
            }
            const referenceRect = referenceRef.current.getBoundingClientRect();
            const targetRect = ele.getBoundingClientRect();
            const containerRect = new DOMRect(0, 0, window.innerWidth, window.innerHeight);
            const rects = [referenceRect, targetRect, containerRect];
            if (rects.some((rect, i) => !areRectsEqual(rect, prevBoundingRectsRef.current[i] || EMPTY_DOM_RECT))) {
                prevBoundingRectsRef.current = rects;

                const bestPlacement = determineBestPosition(referenceRect, targetRect, containerRect, position, offset);
                ele.style.transform = `translate(${bestPlacement.rect.left}px, ${bestPlacement.rect.top}px)`;
            }
        },
        true,
        [ele],
    );

    React.useEffect(() => {
        if (ele) {
            start();
        }
    }, [ele]);

    return ReactDOM.createPortal(children({ ref: targetRef }), document.body);
};
