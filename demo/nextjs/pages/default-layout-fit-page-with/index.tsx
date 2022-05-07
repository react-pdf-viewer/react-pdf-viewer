import { SpecialZoomLevel, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import * as React from 'react';

const IndexPage = () => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    return (
        <div
            style={{
                display: 'flex',
                height: '50rem',
                margin: '5rem auto',
                width: '64rem',
            }}
        >
            <Viewer
                defaultScale={SpecialZoomLevel.PageWidth}
                fileUrl="/pdf-open-parameters.pdf"
                plugins={[defaultLayoutPluginInstance]}
            />
        </div>
    );
};

export default IndexPage;
