import * as React from 'react';
import { SpecialZoomLevel, TextDirection, Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

const Index = () => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.9.359/build/pdf.worker.js">
            <div className="demo">
                <Viewer
                    fileUrl="pdf-open-parameters.pdf"
                    defaultScale={SpecialZoomLevel.PageWidth}
                    theme={{
                        direction: TextDirection.LeftToRight,
                    }}
                    plugins={[defaultLayoutPluginInstance]}
                />
            </div>
        </Worker>
    );
};

export default Index;
