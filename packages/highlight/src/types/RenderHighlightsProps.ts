/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { CSSProperties } from 'react';

import HighlightArea from './HighlightArea';

interface RenderHighlightsProps {
    getCssProperties(area: HighlightArea): CSSProperties;
    pageIndex: number;
    rotation: number;
}

export default RenderHighlightsProps;
