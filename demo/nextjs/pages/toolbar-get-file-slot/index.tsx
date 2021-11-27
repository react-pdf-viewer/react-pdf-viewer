import * as React from 'react';
import { Viewer } from '@react-pdf-viewer/core';
import { RenderDownloadProps } from '@react-pdf-viewer/get-file';
import { toolbarPlugin, ToolbarSlot } from '@react-pdf-viewer/toolbar';

const IndexPage = () => {
    const toolbarPluginInstance = toolbarPlugin();
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
                <Toolbar>
                    {(props: ToolbarSlot) => {
                        const { Download } = props;
                        return (
                            <Download>
                                {(props: RenderDownloadProps) => (
                                    <button
                                        style={{
                                            backgroundColor: '#357edd',
                                            border: 'none',
                                            borderRadius: '4px',
                                            color: '#ffffff',
                                            cursor: 'pointer',
                                            padding: '8px',
                                        }}
                                        onClick={props.onClick}
                                    >
                                        Download
                                    </button>
                                )}
                            </Download>
                        );
                    }}
                </Toolbar>
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
