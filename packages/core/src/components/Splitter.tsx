/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

export interface SplitterSize {
    firstHalfPercentage: number;
    firstHalfSize: number;
    secondHalfPercentage: number;
    secondHalfSize: number;
}

export const Splitter: React.FC<{
    constrain?(size: SplitterSize): boolean;
}> = ({ constrain }) => {
    const resizerRef = React.useRef<HTMLDivElement>();
    const leftSideRef = React.useRef<HTMLElement>();
    const rightSideRef = React.useRef<HTMLElement>();

    // The current position of mouse
    const xRef = React.useRef(0);
    const yRef = React.useRef(0);
    const leftWidthRef = React.useRef(0);

    const handleMouseMove = (e: MouseEvent) => {
        const resizerEle = resizerRef.current;
        const leftSide = leftSideRef.current;
        const rightSide = rightSideRef.current;
        if (!resizerEle || !leftSide || !rightSide) {
            return;
        }

        // How far the mouse has been moved
        const dx = e.clientX - xRef.current;

        const firstHalfSize = leftWidthRef.current + dx;
        const containerWidth = resizerEle.parentElement.getBoundingClientRect().width;
        const firstHalfPercentage = (firstHalfSize * 100) / containerWidth;

        resizerEle.classList.add('rpv-core__splitter--resizing');

        if (constrain) {
            const secondHalfSize = containerWidth - firstHalfSize - resizerEle.getBoundingClientRect().width;
            const secondHalfPercentage = (secondHalfSize * 100) / containerWidth;
            if (!constrain({ firstHalfPercentage, firstHalfSize, secondHalfPercentage, secondHalfSize })) {
                return;
            }
        }

        leftSide.style.width = `${firstHalfPercentage}%`;

        document.body.classList.add('rpv-core__splitter-body--resizing');

        leftSide.classList.add('rpv-core__splitter-sibling--resizing');
        rightSide.classList.add('rpv-core__splitter-sibling--resizing');
    };

    const handleMouseUp = (e: MouseEvent) => {
        const resizerEle = resizerRef.current;
        const leftSide = leftSideRef.current;
        const rightSide = rightSideRef.current;
        if (!resizerEle || !leftSide || !rightSide) {
            return;
        }

        document.body.classList.remove('rpv-core__splitter-body--resizing');

        resizerEle.classList.remove('rpv-core__splitter--resizing');
        leftSide.classList.remove('rpv-core__splitter-sibling--resizing');
        rightSide.classList.remove('rpv-core__splitter-sibling--resizing');

        // Remove the handlers of `mousemove` and `mouseup`
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    // Handle the mousedown event
    // that's triggered when user drags the resizer
    const handleMouseDown = (e: React.MouseEvent) => {
        const leftSide = leftSideRef.current;
        if (!leftSide) {
            return;
        }

        // Get the current mouse position
        xRef.current = e.clientX;
        yRef.current = e.clientY;
        leftWidthRef.current = leftSide.getBoundingClientRect().width;

        // Attach the listeners to `document`
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    React.useEffect(() => {
        const resizerEle = resizerRef.current;
        if (!resizerEle) {
            return;
        }

        leftSideRef.current = resizerEle.previousElementSibling as HTMLElement;
        rightSideRef.current = resizerEle.nextElementSibling as HTMLElement;
    }, []);

    return <div ref={resizerRef} className="rpv-core__splitter" onMouseDown={handleMouseDown} />;
};
