import * as React from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { printPlugin } from '@react-pdf-viewer/print';
// import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/print/lib/styles/index.css';
// import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const App = () => {
    const printPluginInstance = printPlugin();

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.js">            
            <textarea></textarea>
            <div
                style={{
                    height: '720px',
                    width: '640px',
                }}
            >
                <Viewer
                    fileUrl="http://localhost:8001/pdf-open-parameters.pdf"
                    plugins={[
                        // defaultLayoutPluginInstance,
                        printPluginInstance,
                    ]}
                />
            </div>
        </Worker>
    );
};

export default App;
