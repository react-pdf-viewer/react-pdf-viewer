import { ProgressBar, Viewer } from '@react-pdf-viewer/core';
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
                fileUrl={'/5000-of-dummy-optimized.pdf'}
                plugins={[defaultLayoutPluginInstance]}
                renderLoader={(percentages) => (
                    <span data-testid="loading-progress" style={{ width: '16rem' }}>
                        <ProgressBar progress={Math.round(percentages)} />
                    </span>
                )}
            />
        </div>
    );
};

export default IndexPage;
