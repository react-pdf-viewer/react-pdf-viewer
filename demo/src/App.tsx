import * as React from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
// import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/print/lib/styles/index.css';
// import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const App = () => {
    const zoomPluginInstance = zoomPlugin();

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
                        zoomPluginInstance,
                    ]}
                />
            </div>
        </Worker>
    );
};

export default App;
