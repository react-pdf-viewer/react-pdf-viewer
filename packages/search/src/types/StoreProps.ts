/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { type Destination, type PdfJs, type PluginOnTextLayerRender } from '@react-pdf-viewer/core';
import { type MatchPosition } from './MatchPosition';
import { type NormalizedKeyword } from './NormalizedKeyword';
import { type SearchTargetPageFilter } from './SearchTargetPage';
import { type SingleKeyword } from './SingleKeyword';

export interface StoreProps {
    areShortcutsPressed?: boolean;
    doc?: PdfJs.PdfDocument;
    initialKeyword?: SingleKeyword[];
    keyword?: NormalizedKeyword[];
    matchPosition: MatchPosition;
    renderStatus: Map<number, PluginOnTextLayerRender>;
    jumpToDestination?(destination: Destination): void;
    jumpToPage?(pageIndex: number): void;
    targetPageFilter?: SearchTargetPageFilter;
}
