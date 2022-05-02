import * as React from 'react';
import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

const IndexPage = () => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    return (
        <React.StrictMode>
            <div
                style={{
                    display: 'flex',
                    height: '50rem',
                    margin: '5rem auto',
                    width: '64rem',
                }}
            >
                <Viewer fileUrl="/pdf-open-parameters.pdf" plugins={[defaultLayoutPluginInstance]} />
            </div>
        </React.StrictMode>
    );
};

export default IndexPage;
