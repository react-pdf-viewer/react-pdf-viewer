import { Viewer } from '@react-pdf-viewer/core';
import type { PageLayout } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import * as React from 'react';

const IndexPage = () => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    const pageLayout: PageLayout = {
        transformSize: ({ size }) => ({ height: size.height + 30, width: size.width + 30 }),
    };

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
                fileUrl="/pdf-open-parameters.pdf"
                pageLayout={pageLayout}
                plugins={[defaultLayoutPluginInstance]}
            />
        </div>
    );
};

export default IndexPage;
