import React from 'react';
import Viewer, { Worker } from '@phuocng/rpv';
import { SelectionMode } from '@phuocng/rpv-selection-mode';
import toolbarPlugin from '@phuocng/rpv-toolbar';

import '@phuocng/rpv/cjs/rpv.css';
import '@phuocng/rpv-toolbar/cjs/rpv-toolbar.css';

const toolbar = toolbarPlugin({
    searchPlugin: {
        keyword: 'PDF',
    },
    selectionModePlugin: {
        selectionMode: SelectionMode.Text,
    },
});

const { Toolbar } = toolbar;

const App = () => {
    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.4.456/build/pdf.worker.js">
            <div style={{ display: 'flex' }}>
                <Toolbar />
            </div>
            <div style={{ height: '750px' }}>
                <Viewer
                    fileUrl="http://localhost:8001/pdf-open-parameters.pdf"
                    plugins={[
                        toolbar,
                    ]}
                />
            </div>
        </Worker>
    );
};

export default App;
