import { Viewer } from '@react-pdf-viewer/core';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
import * as React from 'react';

const IndexPage = () => {
    const thumbnailPluginInstance = thumbnailPlugin({
        renderSpinner: () => <div className="square-spinner" />,
    });
    const { Thumbnails } = thumbnailPluginInstance;

    return (
        <div
            style={{
                border: '1px solid rgba(0, 0, 0, 0.1)',
                display: 'flex',
                height: '50rem',
                margin: '5rem auto',
                width: '64rem',
            }}
        >
            <div
                style={{
                    alignItems: 'center',
                    borderRight: '1px solid rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    padding: '4px',
                    width: '20%',
                }}
            >
                <Thumbnails />
            </div>
            <div
                style={{
                    flex: 1,
                    overflow: 'hidden',
                }}
            >
                <Viewer fileUrl="/pdf-open-parameters.pdf" plugins={[thumbnailPluginInstance]} />
            </div>
        </div>
    );
};

export default IndexPage;
