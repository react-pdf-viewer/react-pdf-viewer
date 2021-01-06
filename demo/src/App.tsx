import * as React from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';

import '@react-pdf-viewer/core/lib/styles/index.css';

const App = () => {
    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.5.207/build/pdf.worker.js">
            <div
                style={{
                    height: '750px'
                }}
            >
                <Viewer
                    fileUrl="http://localhost:8001/issue-405.pdf"
                    defaultScale={1}
                    plugins={[]}
                />
            </div>
        </Worker>
    );
};

export default App;
