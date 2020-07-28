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
}

export type RenderToolbarSlot = (toolbarSlot: ToolbarSlot) => React.ReactElement;
export type RenderToolbar = (renderToolbar: RenderToolbarSlot) => React.ReactElement;
export default ToolbarSlot;
