import React from 'react';
import { PdfJs, Plugin, PluginOnAnnotationLayerRender, Viewer, Worker } from '@react-pdf-viewer/core';

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

const testAnnotationRenderPlugin = (): Plugin => {
    const onRenderAnnotation = (e: PluginOnAnnotationLayerRender) => {
        console.log(e);
    };

    return {
        onAnnotationLayerRender: onRenderAnnotation,
    };
};

const App = () => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const testAnnotationRenderPluginInstance = testAnnotationRenderPlugin();

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
                        testAnnotationRenderPluginInstance,
                    ]}
                />
            </div>
        </Worker>
    );
};

export default App;
