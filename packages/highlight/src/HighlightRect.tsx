/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { FC } from 'react';

import HighlightArea from './types/HighlightArea';

interface HighlightRectProps {
    area: HighlightArea,
}

const HighlightRect: FC<HighlightRectProps> = ({ area }) => (
    <svg
        style={{
            position: 'absolute',
            top: `${area.top}%`,
            left: `${area.left}%`,
        }}
        height={`${area.height}%`}
        width={`${area.width}%`}
    >
        <rect className='rpv-highlight-rect' />
    </svg>
);

export default HighlightRect;
