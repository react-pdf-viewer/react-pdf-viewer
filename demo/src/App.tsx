import * as React from 'react';
import { PrimaryButton, SpecialZoomLevel, Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { Zoom } from '@react-pdf-viewer/full-screen';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const App = () => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        toolbarPlugin: {
            fullScreenPlugin: {
                onEnterFullScreen: (zoom: Zoom) => {
                    zoom(SpecialZoomLevel.PageFit);
                },
                onExitFullScreen: (zoom: Zoom) => {
                    zoom(SpecialZoomLevel.PageFit);
                },
            }
        }
    });

    const { toolbarPluginInstance } = defaultLayoutPluginInstance;
    const { searchPluginInstance } = toolbarPluginInstance;
    const { clearHighlights, highlight } = searchPluginInstance;

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.5.207/build/pdf.worker.js">
            <div
                style={{
                    display: 'flex',
                    marginBottom: '16px',
                }}
            >
                <div style={{ marginRight: '8px' }}>
                    <PrimaryButton
                        onClick={() => highlight(['document', 'PDF']) }
                    >
                        Highlight: document, PDF
                    </PrimaryButton>
                </div>
                <div style={{ marginRight: '8px' }}>
                    <PrimaryButton
                        onClick={() => highlight(['Adobe', 'Acrobat']) }
                    >
                        Highlight: Adobe, Acrobat
                    </PrimaryButton>
                </div>
                <div style={{ marginRight: '8px' }}>
                    <PrimaryButton
                        onClick={() => clearHighlights() }
                    >
                        Clear highlight
                    </PrimaryButton>
                </div>
            </div>
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
