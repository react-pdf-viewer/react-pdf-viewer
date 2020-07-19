/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

interface ToolbarSlot {
    toggleSidebarButton: React.ReactNode;
    searchPopover: React.ReactNode;
    zoomOutButton: React.ReactNode;
    zoomPopover: React.ReactNode;
    zoomInButton: React.ReactNode;
    rotateClockwiseButton: React.ReactNode;
    rotateCounterclockwiseButton: React.ReactNode;
    textSelectionButton: React.ReactNode;
    handToolButton: React.ReactNode;
    verticalScrollingButton: React.ReactNode;
    horizontalScrollingButton: React.ReactNode;
    wrappedScrollingButton: React.ReactNode;
    documentPropertiesButton: React.ReactNode;
    moreActionsPopover: React.ReactNode;
}

export type RenderToolbarSlot = (toolbarSlot: ToolbarSlot) => React.ReactElement;
export type RenderToolbar = (renderToolbar: RenderToolbarSlot) => React.ReactElement;
export default ToolbarSlot;
