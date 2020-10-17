import React, { ReactElement } from 'react';
import { OpenFile, Viewer, Worker } from '@react-pdf-viewer/core';

import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

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
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.5.207/build/pdf.worker.js">
            <div
                style={{
                    height: '750px'
                }}
            >
                <Viewer
                    fileUrl="http://localhost:8001/pdf-open-parameters.pdf"
                    plugins={[
                        defaultLayoutPluginInstance,
                    ]}
                />
            </div>
        </Worker>
    );
};

export default App;
