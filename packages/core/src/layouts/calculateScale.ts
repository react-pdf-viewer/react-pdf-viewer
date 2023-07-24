/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { SpecialZoomLevel } from '../structs/SpecialZoomLevel';
import { ViewMode } from '../structs/ViewMode';

const SCROLL_BAR_WIDTH = 17;
const PAGE_PADDING = 8;

// Calculate the scale when user zooms the document to given level
export const calculateScale = (
    container: HTMLElement,
    pageHeight: number,
    pageWidth: number,
    scale: SpecialZoomLevel,
    viewMode: ViewMode,
    numPages: number,
): number => {
    let w = pageWidth;
    switch (true) {
        case viewMode === ViewMode.DualPageWithCover && numPages >= 3:
        case viewMode === ViewMode.DualPage && numPages >= 3:
            w = 2 * pageWidth;
            break;
        default:
            w = pageWidth;
            break;
    }

    switch (scale) {
        case SpecialZoomLevel.ActualSize:
            return 1;

        case SpecialZoomLevel.PageFit:
            return Math.min(
                (container.clientWidth - SCROLL_BAR_WIDTH) / w,
                (container.clientHeight - 2 * PAGE_PADDING) / pageHeight,
            );

        case SpecialZoomLevel.PageWidth:
            return (container.clientWidth - SCROLL_BAR_WIDTH) / w;
    }
};
