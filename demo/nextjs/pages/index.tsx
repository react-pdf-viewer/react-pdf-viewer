import * as React from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { dropPlugin } from '@react-pdf-viewer/drop';

const Index = () => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const dropPluginInstance = dropPlugin();

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.10.377/build/pdf.worker.js">
            <div
                style={{
                    display: 'flex',
                    height: '50rem',
                    margin: '5rem auto',
                    width: '64rem',
                }}
            >
                <Viewer
                    fileUrl="/pdf-open-parameters.pdf"
                    plugins={[defaultLayoutPluginInstance, dropPluginInstance]}
                />
            </div>
        </Worker>
    );
};

export default Index;
