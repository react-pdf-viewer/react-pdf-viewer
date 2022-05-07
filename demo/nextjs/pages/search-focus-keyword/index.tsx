import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import * as React from 'react';

const IndexPage = () => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    return (
        <div
            style={{
                height: '720px',
                margin: '150vh auto 0 auto',
                width: '800px',
            }}
        >
            <Viewer fileUrl="/pdf-open-parameters.pdf" plugins={[defaultLayoutPluginInstance]} />
        </div>
    );
};

export default IndexPage;
