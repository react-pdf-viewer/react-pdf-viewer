import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import * as React from 'react';

const IndexPage = () => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        toolbarPlugin: {
            fullScreenPlugin: {
                getFullScreenTarget: (pagesContainer) => pagesContainer.closest('[data-testid="default-layout__body"]'),
                renderExitFullScreenButton: (_) => <></>,
            },
        },
    });

    return (
        <div
            style={{
                height: '50rem',
                margin: '5rem auto',
                width: '64rem',
            }}
        >
            <Viewer fileUrl="/pdf-open-parameters.pdf" plugins={[defaultLayoutPluginInstance]} />
        </div>
    );
};

export default IndexPage;
