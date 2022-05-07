import { Button, DocumentLoadEvent, Viewer } from '@react-pdf-viewer/core';
import type { RenderThumbnailItemProps } from '@react-pdf-viewer/thumbnail';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
import * as React from 'react';

const IndexPage = () => {
    const [selectedPages, setSelectedPages] = React.useState<boolean[]>([]);

    const handleDocumentLoad = (e: DocumentLoadEvent) => {
        setSelectedPages(Array(e.doc.numPages).fill(false));
    };

    const selectAllPages = () => {
        setSelectedPages((selectedPages) => Array(selectedPages.length).fill(true));
    };

    const deselectAllPages = () => {
        setSelectedPages((selectedPages) => Array(selectedPages.length).fill(false));
    };

    const handleChoosePage = (e: React.ChangeEvent<HTMLInputElement>, pageIndex: number) => {
        const isSelected = e.target.checked;
        selectedPages[pageIndex] = isSelected;
        setSelectedPages([...selectedPages]);
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
                <input
                    type="checkbox"
                    checked={selectedPages[props.pageIndex] || false}
                    onChange={(e) => handleChoosePage(e, props.pageIndex)}
                />
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
                    <Button onClick={selectAllPages}>Select all pages</Button>
                </div>
                <div style={{ marginRight: '0.5rem' }}>
                    <Button onClick={deselectAllPages}>Deselect all pages</Button>
                </div>
                <div style={{ marginRight: '0.5rem' }}>
                    Selected pages:{' '}
                    {selectedPages
                        .map((v, idx) => (v ? idx + 1 : false))
                        .filter(Number)
                        .join(', ')}
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
                        borderRight: '1px solid rgba(0, 0, 0, 0.1)',
                        width: '20%',
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
                    <Viewer
                        onDocumentLoad={handleDocumentLoad}
                        fileUrl="/pdf-open-parameters.pdf"
                        plugins={[thumbnailPluginInstance]}
                    />
                </div>
            </div>
        </div>
    );
};

export default IndexPage;
