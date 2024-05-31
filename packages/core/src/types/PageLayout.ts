/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { ScrollMode } from '../structs/ScrollMode';
import { ViewMode } from '../structs/ViewMode';
import { type Rect } from './Rect';

export interface PageLayout {
    buildPageStyles?: ({
        numPages,
        pageIndex,
        scrollMode,
        viewMode,
    }: {
        numPages: number;
        pageIndex: number;
        scrollMode: ScrollMode;
        viewMode: ViewMode;
    }) => React.CSSProperties;
    transformSize?: ({ numPages, pageIndex, size }: { numPages: number; pageIndex: number; size: Rect }) => Rect;
}
