import { Button, Viewer } from '@react-pdf-viewer/core';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
import * as React from 'react';

const IndexPage = () => {
    const [count, setCount] = React.useState(0);
    const triggerRerender = () => setCount((c) => c + 1);
    const [fileUrl, setFileUrl] = React.useState('/pdf-open-parameters.pdf');

    const thumbnailPluginInstance = thumbnailPlugin();
    const { Thumbnails } = thumbnailPluginInstance;

    return (
        <div
            data-testid="root"
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
                <div style={{ marginRight: '0.5rem' }}>
                    <Button testId="load-doc-1" onClick={() => setFileUrl('/pdf-open-parameters.pdf')}>
                        Load document 1
                    </Button>
                </div>
                <Button testId="load-doc-2" onClick={() => setFileUrl('/sample.pdf')}>
                    Load document 2
                </Button>
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
                    <Viewer fileUrl={fileUrl} plugins={[thumbnailPluginInstance]} />
                </div>
            </div>
        </div>
    );
};

export default IndexPage;
