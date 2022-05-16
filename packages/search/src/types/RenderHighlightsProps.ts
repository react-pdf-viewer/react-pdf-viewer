/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

export interface HighlightArea {
    keyword: RegExp;
    keywordStr: string;
    numPages: number;
    pageIndex: number;
    // The position of the highlight element
    left: number;
    top: number;
    // The size of the highlight element
    height: number;
    width: number;
}

export interface RenderHighlightsProps {
    getCssProperties(area: HighlightArea): React.CSSProperties;
    highlightAreas: HighlightArea[];
}
