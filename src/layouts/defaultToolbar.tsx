/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import ToolbarSlot, { RenderToolbarSlot } from './ToolbarSlot';

const defaultToolbar: RenderToolbarSlot = (toolbarSlot: ToolbarSlot): React.ReactElement => {
    return (
        <div
            style={{
                alignItems: 'center',
                display: 'flex',
                width: '100%',
            }}
        >
            <div
                style={{
                    alignItems: 'center',
                    display: 'flex',
                }}
            >
                <div style={{ padding: '0 2px' }}>
                    {toolbarSlot.toggleSidebarButton}
                </div>
                <div style={{ padding: '0 2px' }}>
                    {toolbarSlot.searchPopover}
                </div>
                <div style={{ padding: '0 2px' }}>
                    {toolbarSlot.previousPageButton}
                </div>
                <div style={{ padding: '0 2px' }}>
                    {toolbarSlot.currentPageInput} / {toolbarSlot.numPages}
                </div>
                <div style={{ padding: '0 2px' }}>
                    {toolbarSlot.nextPageButton}
                </div>
            </div>
            <div
                style={{
                    alignItems: 'center',
                    display: 'flex',
                    flexGrow: 1,
                    flexShrink: 1,
                    justifyContent: 'center',
                }}
            >
                <div style={{ padding: '0 2px' }}>
                    {toolbarSlot.zoomOutButton}
                </div>
                <div style={{ padding: '0 2px' }}>
                    {toolbarSlot.zoomPopover}
                </div>
                <div style={{ padding: '0 2px' }}>
                    {toolbarSlot.zoomInButton}
                </div>
            </div>
            <div
                style={{
                    alignItems: 'center',
                    display: 'flex',
                    marginLeft: 'auto',
                }}
            >
                <div style={{ padding: '0 2px' }}>
                    {toolbarSlot.fullScreenButton}
                </div>
                <div style={{ padding: '0 2px' }}>
                    {toolbarSlot.openFileButton}
                </div>
                <div style={{ padding: '0 2px' }}>
                    {toolbarSlot.downloadButton}
                </div>
                <div style={{ padding: '0 2px' }}>
                    {toolbarSlot.printButton}
                </div>
                <div style={{ padding: '0 2px' }}>
                    {toolbarSlot.moreActionsPopover}
                </div>
            </div>
        </div>
    );
};

export default defaultToolbar;
