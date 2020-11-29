/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { FC } from 'react';

import { getCssProperties } from './getCssProperties';
import HighlightArea from './types/HighlightArea';

interface HighlightRectProps {
    area: HighlightArea;
}

const HighlightRect: FC<HighlightRectProps> = ({ area }) => (
    <div
        className='rpv-highlight-rect'
        style={getCssProperties(area, 0)}
    />
);

export default HighlightRect;
