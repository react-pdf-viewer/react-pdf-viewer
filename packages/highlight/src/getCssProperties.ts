/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { CSSProperties } from 'react';

import HighlightArea from './types/HighlightArea';

const getCssProperties = (area: HighlightArea, rotation: number): CSSProperties => {
    const r = rotation >= 0 ? rotation : 360 + rotation;
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

export {
    getCssProperties,
};
