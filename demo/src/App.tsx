import * as React from 'react';
import { PdfJs, Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/print/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const App = () => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.7.570/build/pdf.worker.js">
            <div
                style={{
                    height: '100%',
                    width: '100%',
                }}
            >
                <Viewer
                    fileUrl='pdf-open-parameters.pdf'
                    plugins={[
                        defaultLayoutPluginInstance,
                    ]}
                />
            </div>
        </Worker>
    );
};

export default App;
