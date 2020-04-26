import React from 'react';
import Viewer, { defaultLayout } from '@phuocng/react-pdf-viewer';

const SimpleToolbar = ({ fileUrl }) => {
    const renderToolbar = (toolbarSlot) => {
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
                        {toolbarSlot.previousPageButton}
                    </div>
                    <div style={{ padding: '0 2px' }}>
                        {toolbarSlot.currentPage + 1} / {toolbarSlot.numPages}
                    </div>
                    <div style={{ padding: '0 2px' }}>
                        {toolbarSlot.nextPageButton}
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
                </div>
            </div>
        );
    };

    const layout = (
        isSidebarOpened,
        container,
        main,
        toolbar,
        sidebar,
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
