/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { ReactElement } from 'react';

import { ZoomOutProps } from '@phuocng/rpv-zoom';

interface ToolbarSlot {
    currentPage: ReactElement;
    currentScale: ReactElement;
    currentPageInput: ReactElement;
    downloadButton: ReactElement;
    fullScreenButton: ReactElement;
    goToFirstPage: ReactElement;
    goToLastPage: ReactElement;
    nextPage: ReactElement;
    numberOfPages: ReactElement;
    openFileButton: ReactElement;
    previousPage: ReactElement;
    printButton: ReactElement;
    zoomInButton: ReactElement;
    ZoomOut(props: ZoomOutProps): ReactElement;
    zoomPopover: ReactElement;
}

export type RenderToolbarSlot = (toolbarSlot: ToolbarSlot) => ReactElement;
export type RenderToolbar = (renderToolbar: RenderToolbarSlot) => ReactElement;
export default ToolbarSlot;
