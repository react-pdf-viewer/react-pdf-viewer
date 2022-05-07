import { Button, DocumentLoadEvent, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin, ThumbnailIcon } from '@react-pdf-viewer/default-layout';
import type { RenderThumbnailItemProps } from '@react-pdf-viewer/thumbnail';
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

    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        sidebarTabs: (defaultTabs) =>
            [
                {
                    content: <Thumbnails renderThumbnailItem={renderThumbnailItem} />,
                    icon: <ThumbnailIcon />,
                    title: 'Thumbnails',
                },
            ].concat(defaultTabs.slice(1)),
    });

    const thumbnailPluginInstance = defaultLayoutPluginInstance.thumbnailPluginInstance;
    const { Thumbnails } = thumbnailPluginInstance;

    return (
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
                    height: '50rem',
                }}
            >
                <Viewer
                    onDocumentLoad={handleDocumentLoad}
                    fileUrl="/pdf-open-parameters.pdf"
                    plugins={[defaultLayoutPluginInstance]}
                />
            </div>
        </div>
    );
};

export default IndexPage;
