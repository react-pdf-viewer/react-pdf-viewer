import { Button, Viewer } from '@react-pdf-viewer/core';
import { thumbnailPlugin, type RenderThumbnailItemProps } from '@react-pdf-viewer/thumbnail';
import * as React from 'react';

const IndexPage = () => {
    const [fileUrl, setFileUrl] = React.useState('/pdf-open-parameters.pdf');

    const renderThumbnailItem = (props: RenderThumbnailItemProps) => (
        <div
            key={props.pageIndex}
            className="custom-thumbnail-item"
            data-testid={`thumbnail-${props.pageIndex}`}
            style={{
                backgroundColor: props.pageIndex === props.currentPage ? 'rgba(0, 0, 0, 0.3)' : '#fff',
                cursor: 'pointer',
                padding: '0.5rem',
                width: '100%',
            }}
        >
            <div style={{ marginBottom: '0.5rem' }} onClick={props.onJumpToPage}>
                {props.renderPageThumbnail}
            </div>
            <div
                style={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    margin: '0 auto',
                    width: '100px',
                }}
            >
                <div style={{ marginRight: 'auto' }}>Page {props.renderPageLabel}</div>
            </div>
        </div>
    );

    const thumbnailPluginInstance = thumbnailPlugin({
        thumbnailWidth: 150,
    });
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
                    <Button testId="load-doc-1" onClick={() => setFileUrl('/pdf-open-parameters.pdf')}>
                        Load document 1
                    </Button>
                </div>
                <Button testId="load-doc-2" onClick={() => setFileUrl('/sample-two-pages.pdf')}>
                    Load document 2
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
                    <Thumbnails renderThumbnailItem={renderThumbnailItem} />
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
