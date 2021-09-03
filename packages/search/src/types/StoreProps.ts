/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { SpecialZoomLevel } from '@react-pdf-viewer/core';
import type { PdfJs, PluginOnTextLayerRender } from '@react-pdf-viewer/core';

import type { MatchPosition } from './MatchPosition';
import type { SearchTargetPageFilter } from './SearchTargetPage';

export interface StoreProps {
    areShortcutsPressed?: boolean;
    doc?: PdfJs.PdfDocument;
    keyword?: RegExp[];
    matchPosition?: MatchPosition;
    renderStatus: Map<number, PluginOnTextLayerRender>;
    jumpToDestination?(
        pageIndex: number,
        bottomOffset: number,
        leftOffset: number,
        scaleTo: number | SpecialZoomLevel
    ): void;
    jumpToPage?(pageIndex: number): void;
    targetPageFilter?: SearchTargetPageFilter;
}
