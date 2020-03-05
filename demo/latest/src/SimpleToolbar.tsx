import React from 'react';
import Viewer, { defaultLayout, RenderToolbar, RenderToolbarSlot, Slot, ToolbarSlot } from '@phuocng/react-pdf-viewer';

interface SimpleToolbarProps {
    fileUrl: string;
}

const SimpleToolbar: React.FC<SimpleToolbarProps> = ({ fileUrl }) => {
    const renderToolbar: RenderToolbarSlot = (toolbarSlot: ToolbarSlot) => {
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
                        flexGrow: 1,
                        flexShrink: 1,
                        justifyContent: 'center',
                    }}
                >
                    <div style={{ padding: '0 2px' }}>
                        {toolbarSlot.goToFirstPageButton}
                    </div>
                    <div style={{ padding: '0 2px' }}>
                        {toolbarSlot.previousPageButton}
                    </div>
                    <div style={{ padding: '0 2px' }}>
                        {toolbarSlot.currentPage + 1} / {toolbarSlot.numPages}
                    </div>
                    <div style={{ padding: '0 2px' }}>
                        {toolbarSlot.nextPageButton}
                    </div>
                    <div style={{ padding: '0 2px' }}>
                        {toolbarSlot.goToLastPageButton}
                    </div>
                    <div style={{ padding: '0 2px' }}>
                        {toolbarSlot.rotateClockwiseButton}
                    </div>
                    <div style={{ padding: '0 2px' }}>
                        {toolbarSlot.rotateCounterclockwiseButton}
                    </div>
                    <div style={{ padding: '0 2px' }}>
                        {toolbarSlot.textSelectionButton}
                    </div>
                    <div style={{ padding: '0 2px' }}>
                        {toolbarSlot.handToolButton}
                    </div>
                    <div style={{ padding: '0 2px' }}>
                        {toolbarSlot.verticalScrollingButton}
                    </div>
                    <div style={{ padding: '0 2px' }}>
                        {toolbarSlot.horizontalScrollingButton}
                    </div>
                    <div style={{ padding: '0 2px' }}>
                        {toolbarSlot.wrappedScrollingButton}
                    </div>
                    <div style={{ padding: '0 2px' }}>
                        {toolbarSlot.zoomOutButton}
                    </div>
                    <div style={{ padding: '0 2px' }}>
                        {toolbarSlot.zoomPopover}
                    </div>
                    <div style={{ padding: '0 2px' }}>
                        {toolbarSlot.zoomInButton}
                    </div>
                    <div style={{ padding: '0 2px' }}>
                        {toolbarSlot.documentPropertiesButton}
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

    const layout = (
        isSidebarOpened: boolean,
        container: Slot,
        main: Slot,
        toolbar: RenderToolbar,
        sidebar: Slot,
    ) => {
        return defaultLayout(
            isSidebarOpened,
            container,
            main,
            toolbar(renderToolbar),
            sidebar,
        );
    };

    return (
        <Viewer
            fileUrl={fileUrl}
            layout={layout}
        />
    );
};

export default SimpleToolbar;
