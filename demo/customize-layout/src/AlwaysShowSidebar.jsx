import React from 'react';
import Viewer from '@phuocng/react-pdf-viewer';

const AlwaysShowSidebar = ({ fileUrl }) => {
    const renderToolbar = toolbarSlot => {
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

    const layout = (
        isSidebarOpened,
        container,
        main,
        toolbar,
        sidebar,
    ) => {
        return (
            <div
                {...container.attrs}
                style={Object.assign({}, {
                    border: '1px solid rgba(0, 0, 0, .3)',
                    display: 'grid',
                    gridTemplateAreas: "'toolbar toolbar' 'sidebar main'",
                    gridTemplateColumns: '30% 1fr',
                    gridTemplateRows: '40px calc(100% - 40px)',
                    height: '100%',
                    overflow: 'hidden',
                    width: '100%',
                }, container.attrs.style)}
            >
                {container.children}
                <div
                    style={{
                        alignItems: 'center',
                        backgroundColor: '#EEE',
                        borderBottom: '1px solid rgba(0, 0, 0, .1)',
                        display: 'flex',
                        gridArea: 'toolbar',
                        justifyContent: 'center',
                        padding: '4px',
                    }}
                >
                    {toolbar(renderToolbar)}
                </div>
                <div
                    style={{
                        borderRight: '1px solid rgba(0, 0, 0, 0.2)',
                        display: 'flex',
                        gridArea: 'sidebar',
                        justifyContent: 'center',
                    }}
                >
                    {sidebar.children}
                </div>
                <div
                    {...main.attrs}
                    style={Object.assign({}, {
                        gridArea: 'main',
                        overflow: 'scroll',
                    }, main.attrs.style)}
                >
                    {main.children}
                </div>
            </div>
        );
    };

    return (
        <Viewer
            fileUrl={fileUrl}
            layout={layout}
        />
    );
};

export default AlwaysShowSidebar;
