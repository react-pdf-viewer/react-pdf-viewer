import * as React from 'react';
import { SpecialZoomLevel, TextDirection, Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';

const Index = () => {
    const thumbnailPluginInstance = thumbnailPlugin();
    const { Thumbnails } = thumbnailPluginInstance;

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.9.359/build/pdf.worker.js">
            <div
                style={{
                    border: '1px solid rgba(0, 0, 0, 0.3)',
                    display: 'flex',
                    height: '100%',
                }}
            >
                <div
                    style={{
                        borderRight: '1px solid rgba(0, 0, 0, 0.3)',
                        overflow: 'auto',
                        width: '30%',
                    }}
                >
                    <Thumbnails
                        renderCurrentPageLabel={(props) => (
                            <>
                                {props.pageIndex + 1}
                                {props.pageLabel !== `${props.pageIndex + 1}` && `(${props.pageLabel})`}
                            </>
                        )}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <Viewer fileUrl="/ignore/page-labels-2.pdf" plugins={[thumbnailPluginInstance]} />
                </div>
            </div>
        </Worker>
    );
};

export default Index;
