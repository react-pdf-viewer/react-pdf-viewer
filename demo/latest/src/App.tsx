import React from 'react';
import Viewer, { OpenFile, Worker } from '@phuocng/rpv';
import bookmarkPlugin from '@phuocng/rpv-bookmark';
import toolbarPlugin from '@phuocng/rpv-toolbar';

import '@phuocng/rpv/cjs/rpv.css';
import '@phuocng/rpv-bookmark/cjs/rpv-bookmark.css';
import '@phuocng/rpv-toolbar/cjs/rpv-toolbar.css';

const bookmarkPluginInstance = bookmarkPlugin();
const toolbarPluginInstance = toolbarPlugin({
    downloadPlugin: {
        fileNameGenerator: (file: OpenFile) => {
            const fileName = file.name.substring(file.name.lastIndexOf('/') + 1);
            return `a-copy-of-${fileName}`;
        },
    },
    searchPlugin: {
        keyword: 'PDF',
    },
});


const { Bookmarks } = bookmarkPluginInstance;
const { Toolbar } = toolbarPluginInstance;

const App = () => {
    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.4.456/build/pdf.worker.js">
            <div style={{ display: 'flex' }}>
                <Toolbar />
            </div>
            <div
                style={{
                    display: 'flex',
                    height: '750px'
                }}
            >
                <div
                    style={{
                        overflow: 'auto',
                        width: '25%'
                    }}
                >
                    <Bookmarks />
                </div>
                <div>
                    <Viewer
                        fileUrl="http://localhost:8001/pdf-open-parameters.pdf"
                        plugins={[
                            bookmarkPluginInstance,
                            toolbarPluginInstance,
                        ]}
                    />
                </div>
            </div>
        </Worker>
    );
};

export default App;
