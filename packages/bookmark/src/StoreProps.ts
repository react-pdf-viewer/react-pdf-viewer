/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { PdfJs, SpecialZoomLevel } from '@react-pdf-viewer/core';

export default interface StoreProps {
    doc?: PdfJs.PdfDocument;
    jumpToDestination?: (pageIndex: number, bottomOffset: number, leftOffset: number, scaleTo: number | SpecialZoomLevel) => void;
}
