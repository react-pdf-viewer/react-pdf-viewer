/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { PdfJs, SpecialZoomLevel } from '@react-pdf-viewer/core';

export default interface StoreProps {
    doc?: PdfJs.PdfDocument;
    // Map from dest to the annotation container
    linkAnnotations: Record<string, HTMLElement>;
    jumpToDestination?: (
        pageIndex: number,
        bottomOffset: number,
        leftOffset: number,
        scaleTo: number | SpecialZoomLevel
    ) => void;
}
