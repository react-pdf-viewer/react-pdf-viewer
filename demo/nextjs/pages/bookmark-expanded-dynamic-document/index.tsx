import { bookmarkPlugin } from '@react-pdf-viewer/bookmark';
import { Button, Viewer } from '@react-pdf-viewer/core';
import * as React from 'react';

const IndexPage = () => {
    const [fileUrl, setFileUrl] = React.useState('/bookmarks-level-1.pdf');

    const bookmarkPluginInstance = bookmarkPlugin();
    const { Bookmarks } = bookmarkPluginInstance;

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
                    <Button testId="load-doc-1" onClick={() => setFileUrl('/bookmarks-level-1.pdf')}>
                        Load document 1
                    </Button>
                </div>
                <div style={{ marginRight: '0.5rem' }}>
                    <Button testId="load-doc-2" onClick={() => setFileUrl('/bookmarks-level-2.pdf')}>
                        Load document 2
                    </Button>
                </div>
                <Button testId="load-doc-3" onClick={() => setFileUrl('/bookmarks-level-3.pdf')}>
                    Load document 3
                </Button>
            </div>
            <div
                style={{
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    height: '50rem',
                    width: '100%',
                }}
            >
                <div
                    style={{
                        borderRight: '1px solid rgba(0, 0, 0, 0.1)',
                        width: '15rem',
                    }}
                >
                    <Bookmarks />
                </div>
                <div
                    style={{
                        flex: 1,
                        overflow: 'hidden',
                    }}
                >
                    <Viewer fileUrl={fileUrl} plugins={[bookmarkPluginInstance]} />
                </div>
            </div>
        </div>
    );
};

export default IndexPage;
