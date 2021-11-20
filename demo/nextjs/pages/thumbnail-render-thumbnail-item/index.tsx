import * as React from 'react';
import { Button, Viewer, Worker } from '@react-pdf-viewer/core';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
import type { DocumentLoadEvent } from '@react-pdf-viewer/core';
import type { RenderThumbnailItemProps } from '@react-pdf-viewer/thumbnail';

const IndexPage = () => {
    const [selectedPages, setSelectedPages] = React.useState<Record<string, boolean>>({});
    const [numPages, setNumPages] = React.useState(0);

    const selectAllPages = () => {
        const selectedPages = {};
        Array(numPages)
            .fill(0)
            .forEach((_, i) => (selectedPages[`${i}`] = true));
        setSelectedPages(selectedPages);
    };

    const handleChoosePage = (e: React.ChangeEvent<HTMLInputElement>, pageIndex: number) => {
        setSelectedPages((selectedPages) => Object.assign({}, selectedPages, { [`${pageIndex}`]: e.target.checked }));
    };

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
        >
            <div style={{ marginBottom: '0.25rem' }} onClick={props.onJumpToPage}>
                {props.renderPageThumbnail}
            </div>
            <div
                style={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <div>Page {props.renderPageLabel}</div>
                <input
                    type="checkbox"
                    checked={selectedPages[`${props.pageIndex}`]}
                    onChange={(e) => handleChoosePage(e, props.pageIndex)}
                />
            </div>
        </div>
    );

    const thumbnailPluginInstance = thumbnailPlugin({
        renderThumbnailItem,
    });
    const { Thumbnails } = thumbnailPluginInstance;

    const handleDocumentLoad = (e: DocumentLoadEvent) => {
        setNumPages(e.doc.numPages);
    };

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
                        <Button onClick={selectAllPages}>Select all pages</Button>
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
                        <Viewer
                            onDocumentLoad={handleDocumentLoad}
                            fileUrl="/pdf-open-parameters.pdf"
                            plugins={[thumbnailPluginInstance]}
                        />
                    </div>
                </div>
            </div>
        </Worker>
    );
};

export default IndexPage;
