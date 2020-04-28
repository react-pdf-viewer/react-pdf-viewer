import Viewer, {
    defaultLayout,
    RenderPageProps,
    RenderToolbar,
    Slot,
    ToolbarSlot,
} from '@phuocng/react-pdf-viewer';
import React from 'react';

interface RemoveTextLayerExampleProps {
    fileUrl: string;
}

const RemoveTextLayerExample: React.FC<RemoveTextLayerExampleProps> = ({ fileUrl }) => {
    const renderPage = (props: RenderPageProps) => {
        return (
            <>
                {props.canvasLayer.children}
                {props.annotationLayer.children}
            </>
        );
    };

    const renderToolbar = (toolbarSlot: ToolbarSlot): React.ReactElement => {
        return (
            <div
                style={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                }}
            >
                <div
                    style={{
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <div style={{ padding: '0 2px' }}>
                        {toolbarSlot.toggleSidebarButton}
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
                        justifyContent: 'center',
                    }}
                >
                    <div style={{ padding: '0 2px' }}>
                        {toolbarSlot.fullScreenButton}
                    </div>
                    <div style={{ padding: '0 2px' }}>
                        {toolbarSlot.openFileButton}
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
    ): React.ReactElement => {
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
            renderPage={renderPage}
        />
    );
};

export default RemoveTextLayerExample;
