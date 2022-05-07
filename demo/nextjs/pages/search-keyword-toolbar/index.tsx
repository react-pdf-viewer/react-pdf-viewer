import { Viewer } from '@react-pdf-viewer/core';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import * as React from 'react';

const IndexPage = () => {
    const toolbarPluginInstance = toolbarPlugin({
        searchPlugin: {
            keyword: ['document'],
        },
    });
    const { Toolbar } = toolbarPluginInstance;

    return (
        <div
            style={{
                border: '1px solid rgba(0, 0, 0, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                height: '50rem',
                margin: '5rem auto',
                width: '50rem',
            }}
        >
            <div
                style={{
                    alignItems: 'center',
                    backgroundColor: '#eeeeee',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    padding: '4px',
                }}
            >
                <Toolbar />
            </div>
            <div
                style={{
                    flex: 1,
                    overflow: 'hidden',
                }}
            >
                <Viewer fileUrl="/pdf-open-parameters.pdf" plugins={[toolbarPluginInstance]} />
            </div>
        </div>
    );
};

export default IndexPage;
