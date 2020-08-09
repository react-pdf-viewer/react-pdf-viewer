import React from 'react';
import Viewer, { OpenFile, Worker } from '@phuocng/rpv';

import DefaultLayout from '@phuocng/rpv-default-layout';

import '@phuocng/rpv/cjs/rpv.css';
import '@phuocng/rpv-default-layout/cjs/rpv-default-layout.css';

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
