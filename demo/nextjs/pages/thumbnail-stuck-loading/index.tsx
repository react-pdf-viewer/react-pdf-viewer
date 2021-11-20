import * as React from 'react';
import { Button, Viewer, Worker } from '@react-pdf-viewer/core';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';

const IndexPage = () => {
    const [count, setCount] = React.useState(0);
    const triggerRerender = () => setCount((c) => c + 1);

    const thumbnailPluginInstance = thumbnailPlugin();
    const { Thumbnails } = thumbnailPluginInstance;

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.10.377/build/pdf.worker.js">
            <div
                style={{
                    margin: '1rem auto',
                    width: '64rem',
                }}
            >
                <div
                    style={{
                        alignItems: 'center',
                        display: 'flex',
                        marginBottom: '1rem',
                    }}
                >
                    <div style={{ marginRight: '0.5rem' }}>
                        <Button testId="trigger-rerender" onClick={triggerRerender}>
                            Trigger re-render (count={count})
                        </Button>
                    </div>
                </div>
                <div
                    style={{
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        height: '50rem',
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
            </div>
        </Worker>
    );
};

export default IndexPage;
