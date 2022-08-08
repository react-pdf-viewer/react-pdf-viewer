import { bookmarkPlugin } from '@react-pdf-viewer/bookmark';
import { Button, Viewer } from '@react-pdf-viewer/core';
import * as React from 'react';

const IndexPage = () => {
    const [fileUrl, setFileUrl] = React.useState('/pdf-open-parameters.pdf');
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
                <Button testId="load-other-doc" onClick={() => setFileUrl('/bookmark.pdf')}>
                    Load other document
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
                        borderRight: '1px solid rgba(0, 0, 0, 0.1)',
                        width: '20%',
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
