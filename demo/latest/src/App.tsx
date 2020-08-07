import React from 'react';
import Viewer, { OpenFile, Worker } from '@phuocng/rpv';

import defaultLayoutPlugin from '@phuocng/rpv-default-layout';

import '@phuocng/rpv/cjs/rpv.css';
import '@phuocng/rpv-default-layout/cjs/rpv-default-layout.css';

const defaultLayoutPluginInstance = defaultLayoutPlugin();
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
