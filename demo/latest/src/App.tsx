import React from 'react';
import { OpenFile, Viewer, Worker } from '@react-pdf-viewer/core';

import { DefaultLayout } from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/core/styles/index.css';
import '@react-pdf-viewer/default-layout/styles/index.css';

// const toolbarPluginInstance = toolbarPlugin({
//     downloadPlugin: {
//         fileNameGenerator: (file: OpenFile) => {
//             const fileName = file.name.substring(file.name.lastIndexOf('/') + 1);
//             return `a-copy-of-${fileName}`;
//         },
//     },
//     searchPlugin: {
//         keyword: 'PDF',
//     },
// });

const App = () => {
    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.4.456/build/pdf.worker.js">
            <div
                style={{
                    height: '750px'
                }}
            >
                <DefaultLayout
                    fileUrl="http://localhost:8001/pdf-open-parameters.pdf"
                />
            </div>
        </Worker>
    );
};

export default App;
