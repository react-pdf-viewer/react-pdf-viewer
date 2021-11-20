import * as React from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
import type { RenderThumbnailItemProps } from '@react-pdf-viewer/thumbnail';

const IndexPage = () => {
    const renderThumbnailItem = (props: RenderThumbnailItemProps) => (
        <div
            key={props.pageIndex}
            className="custom-thumbnail-item"
            data-testid={`thumbnail-${props.pageIndex}`}
            style={{
                backgroundColor: props.pageIndex === props.currentPage ? 'rgba(0, 0, 0, 0.3)' : '#fff',
                cursor: 'pointer',
                padding: '0.5rem',
            }}
            onClick={props.onJumpToPage}
        >
            {props.renderPageThumbnail}
        </div>
    );

    const thumbnailPluginInstance = thumbnailPlugin({
        renderThumbnailItem,
    });
    const { Thumbnails } = thumbnailPluginInstance;

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.10.377/build/pdf.worker.js">
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
        </Worker>
    );
};

export default IndexPage;
