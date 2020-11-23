import React from 'react';
import { Button, Position, PrimaryButton, Tooltip, Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { highlightPlugin, RenderHighlightContentProps, RenderHighlightTargetProps } from '@react-pdf-viewer/highlight';

import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/highlight/lib/styles/index.css';
import './styles.css';

const App = () => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    const renderHighlightTarget = (props: RenderHighlightTargetProps) => (
        <div
            style={{
                position: 'absolute',
                left: `${props.selectionRegion.left}%`,
                top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
            }}
        >
            <Tooltip
                position={Position.TopCenter}
                target={
                    <PrimaryButton onClick={props.toggle}>
                        +
                    </PrimaryButton>
                }
                content={() => 'Add a note'}
                offset={{ left: 0, top: -8 }}
            />
        </div>
    );

    const renderHighlightContent = (props: RenderHighlightContentProps) => {
        const addNote = () => {
            console.log(props.selectedText)
        };

        return (
            <div
                style={{
                    background: '#fff',
                    border: '1px solid rgba(0, 0, 0, .3)',
                    borderRadius: '2px',
                    padding: '8px',
                    position: 'absolute',
                    left: `${props.selectionRegion.left}%`,
                    top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
                    zIndex: 1,
                }}
            >
                <div>
                    <textarea
                        rows={3}
                        style={{
                            border: '1px solid rgba(0, 0, 0, .3)',
                        }}
                    ></textarea>
                </div>
                <div
                    style={{
                        display: 'flex',
                        marginTop: '8px',
                    }}
                >
                    <div style={{ marginRight: '8px' }}>
                        <PrimaryButton onClick={addNote}>Add</PrimaryButton>
                    </div>
                    <Button onClick={props.cancel}>Cancel</Button>
                </div>
            </div>
        );
    };

    const highlightPluginInstance = highlightPlugin({
        renderHighlightTarget,
        renderHighlightContent,
    });

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.5.207/build/pdf.worker.js">
            <div
                style={{
                    height: '750px'
                }}
            >
                <Viewer
                    fileUrl="http://localhost:8001/pdf-open-parameters.pdf"
                    plugins={[
                        highlightPluginInstance,
                        defaultLayoutPluginInstance,
                    ]}
                />
            </div>
        </Worker>
    );
};

export default App;
