import React, { useState } from 'react';
import { Button, Position, PrimaryButton, Tooltip, Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { HighlightArea, highlightPlugin, MessageIcon, RenderHighlightContentProps, RenderHighlightTargetProps, RenderHighlightsProps } from '@react-pdf-viewer/highlight';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/highlight/lib/styles/index.css';
import './styles.css';

interface Note {
    content: string;
    highlightAreas: HighlightArea[];
    quote: string;
}

const flat = (arr: any[]): any[] => [].concat.apply([], arr.map(a => Array.isArray(a) ? flat(a) : a));

const App = () => {
    const [message, setMessage] = useState('');
    const [notes, setNotes] = useState<Note[]>([]);
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    const renderHighlightTarget = (props: RenderHighlightTargetProps) => (
        <div
            style={{
                background: '#eee',
                display: 'flex',
                position: 'absolute',
                left: `${props.selectionRegion.left}%`,
                top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
                transform: 'translate(0, 8px)',
            }}
        >
            <Tooltip
                position={Position.TopCenter}
                target={<Button onClick={props.toggle}><MessageIcon /></Button>}
                content={() => <div style={{ width: '100px' }}>Add a note</div>}
                offset={{ left: 0, top: -8 }}
            />
        </div>
    );

    const renderHighlightContent = (props: RenderHighlightContentProps) => {
        const addNote = () => {
            if (message !== '') {
                const note: Note = {
                    content: message,
                    highlightAreas: props.highlightAreas,
                    quote: props.selectedText,
                };
                setNotes(notes.concat([note]));
                props.cancel();
            }
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
                        onChange={e => setMessage(e.target.value)}
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

    const renderHighlights = (props: RenderHighlightsProps) => {
        const highlights = flat(notes.map(note => note.highlightAreas)) as HighlightArea[];
        const pageHighlights = highlights.filter(note => note.pageIndex === props.pageIndex);
        return (
            <>
            {
                pageHighlights.map((area, idx) => (
                    <svg
                        key={idx}
                        style={{
                            position: 'absolute',
                            top: `${area.top}%`,
                            left: `${area.left}%`,
                        }}
                        height={`${area.height}%`}
                        width={`${area.width}%`}
                    >
                        <rect className='rpv-highlight-rect' />
                    </svg>                
                ))
            }
            </>
        );
    };

    const highlightPluginInstance = highlightPlugin({
        renderHighlightTarget,
        renderHighlightContent,
        renderHighlights,
    });

    const { jumpToHighlightArea } = highlightPluginInstance;

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.5.207/build/pdf.worker.js">
            <div
                style={{
                    height: '750px'
                }}
            >
                <div
                    style={{
                        border: '1px solid rgba(0, 0, 0, 0.3)',
                        cursor: 'pointer',
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
                        {
                            notes.map((note, idx) => {
                                return (
                                    <div
                                        key={idx}
                                        style={{
                                            borderBottom: '1px solid rgba(0, 0, 0, .3)',
                                            padding: '8px',
                                        }}
                                        onClick={() => jumpToHighlightArea(note.highlightAreas[0])}
                                    >
                                        <blockquote
                                            style={{
                                                borderLeft: '2px solid rgba(0, 0, 0, 0.2)',
                                                fontSize: '.75rem',
                                                lineHeight: 1.5,
                                                margin: '0 0 8px 0',
                                                paddingLeft: '8px',
                                                textAlign: 'justify',
                                            }}
                                        >
                                            {note.quote}
                                        </blockquote>
                                        {note.content}
                                    </div>
                                );
                            })
                        }
                    </div>
                    <div style={{ flex: 1 }}>
                        <Viewer
                            fileUrl="http://localhost:8001/pdf-open-parameters.pdf"
                            plugins={[
                                highlightPluginInstance,
                            ]}
                        />
                    </div>
                </div>
            </div>
        </Worker>
    );
};

export default App;
