import * as React from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

const Index = () => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const handleSwitchTheme = (theme: string) => {
        localStorage.setItem('theme', theme);
    };
    const theme = localStorage.getItem('theme') || '';

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.8.335/build/pdf.worker.js">
            <Viewer
                fileUrl='pdf-open-parameters.pdf'
                plugins={[
                    defaultLayoutPluginInstance,
                ]}
                theme={theme}
                onSwitchTheme={handleSwitchTheme}
            />
        </Worker>
    );
};

export default Index;