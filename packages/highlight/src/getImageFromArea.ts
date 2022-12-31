/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { HighlightArea } from './types/HighlightArea';

export const getImageFromArea = () => {
    const newCanvas = document.createElement('canvas');
    const dpr = window.devicePixelRatio || 1;

    return (canvasEle: HTMLCanvasElement, highlightArea: HighlightArea): string => {
        const canvasRect = canvasEle.getBoundingClientRect();
        const left = (highlightArea.left * canvasRect.width) / 100;
        const top = (highlightArea.top * canvasRect.height) / 100;
        const width = (highlightArea.width * canvasRect.width) / 100;
        const height = (highlightArea.height * canvasRect.height) / 100;

        const context = newCanvas.getContext('2d');
        newCanvas.width = width;
        newCanvas.height = height;

        context?.drawImage(canvasEle, left * dpr, top * dpr, width * dpr, height * dpr, 0, 0, width, height);
        return newCanvas.toDataURL('image/png');
    };
};
