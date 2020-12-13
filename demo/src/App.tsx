import React, { Fragment, useEffect, useState } from 'react';
import { Button, DocumentLoadEvent, PdfJs, Position, PrimaryButton, Tooltip, Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { HighlightArea, highlightPlugin, MessageIcon, RenderHighlightContentProps, RenderHighlightTargetProps, RenderHighlightsProps } from '@react-pdf-viewer/highlight';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/highlight/lib/styles/index.css';
import './styles.css';

interface Note {
    id: number;
    content: string;
    highlightAreas: HighlightArea[];
    quote: string;
}

let noteId = 0;

const App = () => {
    const [message, setMessage] = useState('');
    const [notes, setNotes] = useState<Note[]>([]);
    const noteEles: Map<number, HTMLElement> = new Map();
    const [currentDoc, setCurrentDoc] = useState<PdfJs.PdfDocument | null>(null);

    const handleDocumentLoad = (e: DocumentLoadEvent) => {
        setCurrentDoc(e.doc);
        if (currentDoc && currentDoc !== e.doc) {
            // User opens new document
            setNotes([]);
        }
    };

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
                    id: ++noteId,
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

    const jumpToNote = (note: Note) => {
        if (noteEles.has(note.id)) {
            noteEles.get(note.id).scrollIntoView();
        }
    };

    const renderHighlights = (props: RenderHighlightsProps) => (
        <div>
        {
            notes.map(note => (
                <Fragment key={note.id}>
                {
                    note.highlightAreas
                        .filter(area => area.pageIndex === props.pageIndex)
                        .map((area, idx) => (
                            <div
                                key={idx}
                                style={
                                    Object.assign({}, {
                                        background: 'yellow',
                                        opacity: 0.4,
                                    }, props.getCssProperties(area, props.rotation))
                                }
                                onClick={() => jumpToNote(note)}
                            />
                        ))
                }
                </Fragment>
            ))
        }
        </div>
    );

    const highlightPluginInstance = highlightPlugin({
        renderHighlightTarget,
        renderHighlightContent,
        renderHighlights,
    });

    const { jumpToHighlightArea } = highlightPluginInstance;

    useEffect(() => {
        return () => {
            noteEles.clear();
        };
    }, []);

    const sidebarNotes = (
        <div
            style={{
                overflow: 'auto',
                width: '100%',
            }}
        >
            {notes.length === 0 && <div style={{ textAlign: 'center' }}>There is no note</div>}
            {
                notes.map(note => {
                    return (
                        <div
                            key={note.id}
                            style={{
                                borderBottom: '1px solid rgba(0, 0, 0, .3)',
                                cursor: 'pointer',
                                padding: '8px',
                            }}
                            onClick={() => jumpToHighlightArea(note.highlightAreas[0])}
                            ref={(ref): void => {
                                noteEles.set(note.id, ref as HTMLElement);
                            }}
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
    );

    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        sidebarTabs: defaultTabs => defaultTabs.concat({
            content: sidebarNotes,
            icon: <MessageIcon />,
            title: <>Notes</>,
        }),
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
                    onDocumentLoad={handleDocumentLoad}
                />
            </div>
        </Worker>
    );
};

export default App;
