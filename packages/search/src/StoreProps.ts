/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { PdfJs, PluginOnTextLayerRender, SpecialZoomLevel } from '@react-pdf-viewer/core';

import Match from './Match';

export default interface StoreProps {
    doc?: PdfJs.PdfDocument;
    keyword?: RegExp;
    match?: Match;
    renderStatus: Map<number, PluginOnTextLayerRender>;
    jumpToDestination?(pageIndex: number, bottomOffset: number, scaleTo: number | SpecialZoomLevel): void;
    jumpToPage?(pageIndex: number): void;
}
