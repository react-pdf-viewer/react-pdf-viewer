import * as React from 'react';
import { PrimaryButton, SpecialZoomLevel, Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { Zoom } from '@react-pdf-viewer/full-screen';
import { OnHighlightKeyword } from '@react-pdf-viewer/search';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const App = () => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        toolbarPlugin: {
            searchPlugin: {
                // keyword: ['document', 'PDF'], // 'supported by',
                onHighlightKeyword: (props: OnHighlightKeyword) => {
                    if (props.keyword.source === 'document') {
                        props.highlightEle.style.outline = '2px dashed blue';
                        props.highlightEle.style.backgroundColor = 'rgba(0, 0, 0, .1)';
                    }
                },
            },
            fullScreenPlugin: {
                onEnterFullScreen: (zoom: Zoom) => {
                    zoom(SpecialZoomLevel.PageFit);
                },
                onExitFullScreen: (zoom: Zoom) => {
                    zoom(SpecialZoomLevel.PageFit);
                },
            }
        }
    });

    const { toolbarPluginInstance } = defaultLayoutPluginInstance;
    const { pageNavigationPluginInstance, searchPluginInstance, zoomPluginInstance } = toolbarPluginInstance;
    const { clearHighlights, highlight, jumpToPreviousMatch, jumpToNextMatch } = searchPluginInstance;
    const { zoomTo } = zoomPluginInstance;
    const { jumpToPage } = pageNavigationPluginInstance;

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.js">
            <div
                style={{
                    display: 'flex',
                    marginBottom: '16px',
                }}
            >
                <div style={{ marginRight: '8px' }}>
                    <PrimaryButton
                        onClick={() => highlight([
                            'document',
                            {
                                keyword: 'PDF',
                                matchCase: true,
                            },
                        ])}
                    >
                        Highlight: document, PDF
                    </PrimaryButton>
                </div>
                <div style={{ marginRight: '8px' }}>
                    <PrimaryButton
                        onClick={() => jumpToPreviousMatch() }
                    >
                        Jump to previous match
                    </PrimaryButton>
                </div>
                <div style={{ marginRight: '8px' }}>
                    <PrimaryButton
                        onClick={() => jumpToNextMatch() }
                    >
                        Jump to next match
                    </PrimaryButton>
                </div>
                <div style={{ marginRight: '8px' }}>
                    <PrimaryButton
                        onClick={() => jumpToPage(2) }
                    >
                        Jump to page 3
                    </PrimaryButton>
                </div>
                <div style={{ marginRight: '8px' }}>
                    <PrimaryButton
                        onClick={() => zoomTo(1.5) }
                    >
                        Zoom to 150%
                    </PrimaryButton>
                </div>
            </div>
            <div
                style={{
                    height: '720px',
                    width: '640px',
                }}
            >
                <Viewer
                    fileUrl="http://localhost:8001/pdf-open-parameters.pdf"
                    plugins={[
                        defaultLayoutPluginInstance,
                    ]}
                />
            </div>
        </Worker>
    );
};

export default App;
