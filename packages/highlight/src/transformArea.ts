/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { CSSProperties } from 'react';

import HighlightArea from './types/HighlightArea';

const normalizeRotation = (rotation: number): number => rotation >= 0 ? rotation : 360 + rotation;

const getCssProperties = (area: HighlightArea, rotation: number): CSSProperties => {
    const r = normalizeRotation(rotation);
    switch (r) {
        case 90:
            return {
                height: `${area.width}%`,
                position: 'absolute',
                right: `${area.top}%`,
                top: `${area.left}%`,
                width: `${area.height}%`,
            };
        case 180:
            return {
                bottom: `${area.top}%`,
                height: `${area.height}%`,
                position: 'absolute',
                right: `${area.left}%`,
                width: `${area.width}%`,
            };
        case 270:
            return {
                height: `${area.width}%`,
                position: 'absolute',
                left: `${area.top}%`,
                bottom: `${area.left}%`,
                width: `${area.height}%`,
            };
        case 0:
        case 360:
        default:
            return {
                height: `${area.height}%`,
                position: 'absolute',
                top: `${area.top}%`,
                left: `${area.left}%`,
                width: `${area.width}%`,
            };
    }
};

const transformArea = (area: HighlightArea, rotation: number): HighlightArea => {
    const r = normalizeRotation(rotation);
    console.log(rotation, r, area);
    switch (r) {
        case 90:
            return {
                height: area.width,
                left: area.top,
                pageIndex: area.pageIndex,
                top: 100 - area.width - area.left,
                width: area.height,
            };
        case 180:
            return {
                height: area.height,
                left: 100 - area.width - area.left,
                pageIndex: area.pageIndex,
                top: 100 - area.height - area.top,
                width: area.width,
            };
        case 270:
            return {
                height: area.width,
                left: 100 - area.height - area.top,
                pageIndex: area.pageIndex,
                top: area.left,
                width: area.height,
            };
        case 0:
        case 360:
        default:
            return area;
    }
};

export {
    getCssProperties,
    transformArea,
};
