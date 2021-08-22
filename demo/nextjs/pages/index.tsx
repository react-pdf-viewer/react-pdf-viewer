import * as React from 'react';
import { DocumentLoadEvent, Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

const Index = () => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    const handleDocumentLoad = (e: DocumentLoadEvent) => {
        console.log(e.file.name, e.file.data);
    };

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.9.359/build/pdf.worker.js">
            <div className="demo">
                <Viewer
                    fileUrl="pdf-open-parameters.pdf"
                    onDocumentLoad={handleDocumentLoad}
                    plugins={[defaultLayoutPluginInstance]}
                />
            </div>
        </Worker>
    );
};

export default Index;
