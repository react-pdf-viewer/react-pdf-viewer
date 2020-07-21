/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { ReactElement } from 'react';

interface ToolbarSlot {
    currentPage: ReactElement;
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
    zoomOutButton: ReactElement;
}

export type RenderToolbarSlot = (toolbarSlot: ToolbarSlot) => ReactElement;
export type RenderToolbar = (renderToolbar: RenderToolbarSlot) => ReactElement;
export default ToolbarSlot;
