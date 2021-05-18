/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import SpecialZoomLevel from '../SpecialZoomLevel';

const SCROLL_BAR_WIDTH = 17;
const PAGE_PADDING = 8;

// Calculate the scale when user zooms the document to given level
const calculateScale = (
    container: HTMLElement,
    pageHeight: number,
    pageWidth: number,
    scale: SpecialZoomLevel
): number => {
    switch (scale) {
        case SpecialZoomLevel.ActualSize:
            return 1;

        case SpecialZoomLevel.PageFit:
            return Math.min(
                (container.clientWidth - SCROLL_BAR_WIDTH) / pageWidth,
                (container.clientHeight - 2 * PAGE_PADDING) / pageHeight
            );

        case SpecialZoomLevel.PageWidth:
            return (container.clientWidth - SCROLL_BAR_WIDTH) / pageWidth;
    }
};

export default calculateScale;
