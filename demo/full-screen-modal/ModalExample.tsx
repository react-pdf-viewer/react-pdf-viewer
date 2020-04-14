import Viewer, {
    Button,
    defaultLayout,
    Position,
    RenderToolbar,
    Slot,
    ToolbarSlot,
    Tooltip,
} from '@phuocng/react-pdf-viewer';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import CloseIcon from './CloseIcon';

const ModalExample: React.FC<{}> = () => {
    const [shown, setShown] = useState(false);

    const renderToolbar = (toolbarSlot: ToolbarSlot): React.ReactElement => {
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
                    <div></div>
                    <div style={{ marginLeft: 'auto', padding: '0 2px' }}>
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
                    <div style={{ marginLeft: 'auto', padding: '0 2px' }}>
                        <Tooltip
                            position={Position.BottomRight}
                            target={<Button onClick={() => setShown(false)}><CloseIcon /></Button>}
                            content={() => 'Close'}
                            offset={{ left: 0, top: 8 }}
                        />
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

    const modalBody = () => (
        <div
            style={{
                backgroundColor: '#fff',

                /* Fixed position */
                left: 0,
                position: 'fixed',
                top: 0,

                /* Take full size */
                height: '100%',
                width: '100%',

                /* Displayed on top of other elements */
                zIndex: 9999,

                /* Make the content scrollable */
                overflow: 'auto',
            }}
        >
            <Viewer fileUrl="/assets/pdf-open-parameters.pdf" layout={layout} />
        </div>
    );

    return (
        <>
            <button
                style={{
                    backgroundColor: '#00449e',
                    border: 'none',
                    borderRadius: '.25rem',
                    color: '#fff',
                    cursor: 'pointer',
                    padding: '.5rem',
                }}
                onClick={() => setShown(true)}
            >
                Open modal
            </button>
            {shown && ReactDOM.createPortal(modalBody(), document.body)}
        </>
    );
};

export default ModalExample;
