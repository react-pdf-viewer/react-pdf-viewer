import * as React from 'react';
import { SpecialZoomLevel, Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/print/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const App = () => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        toolbarPlugin: {
            printPlugin: {
                enableShortcuts: false,
            },
            zoomPlugin: {
                enableShortcuts: true,
            },
        },
    });

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.7.570/build/pdf.worker.js">
            <div
                style={{
                    marginTop: '100px',
                    height: '720px',
                    width: '100%',
                }}
            >
                <Viewer
                    fileUrl='pdf-open-parameters.pdf'
                    initialPage={3}
                    // theme='auto'
                    defaultScale={SpecialZoomLevel.PageFit}
                    plugins={[
                        defaultLayoutPluginInstance,
                    ]}
                />
            </div>
        </Worker>
    );
};

export default App;
