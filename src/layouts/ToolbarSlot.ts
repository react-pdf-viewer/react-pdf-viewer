/**
 * A React component to view a PDF document
 * 
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

interface ToolbarSlot {
    currentPage: number;
    numPages: number;
    toggleSidebarButton: React.ReactNode;
    searchPopover: React.ReactNode;
    previousPageButton: React.ReactNode;
    nextPageButton: React.ReactNode;
    currentPageInput: React.ReactNode;
    zoomOutButton: React.ReactNode;
    zoomPopover: React.ReactNode;
    zoomInButton: React.ReactNode;
    fullScreenButton: React.ReactNode;
    downloadButton: React.ReactNode;
    openFileButton: React.ReactNode;
    moreActionsPopover: React.ReactNode;
}

type RenderToolbarSlot = (slot: ToolbarSlot) => React.ReactElement;
type RenderToolbar = (renderToolbar: RenderToolbarSlot) => React.ReactElement;

export { RenderToolbar, RenderToolbarSlot };
export default ToolbarSlot;
