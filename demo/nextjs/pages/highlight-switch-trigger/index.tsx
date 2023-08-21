import { Button, Position, PrimaryButton, Tooltip, Viewer } from '@react-pdf-viewer/core';
import {
    HighlightArea,
    MessageIcon,
    RenderHighlightContentProps,
    RenderHighlightTargetProps,
    RenderHighlightsProps,
    Trigger,
    highlightPlugin,
} from '@react-pdf-viewer/highlight';
import * as React from 'react';

interface Note {
    id: number;
    content: string;
    highlightAreas: HighlightArea[];
    previewImage: string;
    quote: string;
}

const IndexPage = () => {
    const [message, setMessage] = React.useState('');
    const [notes, setNotes] = React.useState<Note[]>([
        {
            id: 1,
            content: 'First note',
            highlightAreas: [
                {
                    height: 1.4029242201714198,
                    left: 19.87741677383527,
                    pageIndex: 3,
                    top: 15.131852956005174,
                    width: 72.93121967615596,
                },
                {
                    height: 2.5252635963085557,
                    left: 0,
                    pageIndex: 3,
                    top: 4.349065082531402,
                    width: 0,
                },
                {
                    height: 1.4029242201714198,
                    left: 16.361723271175542,
                    pageIndex: 3,
                    top: 16.714526841886055,
                    width: 29.192043096393288,
                },
            ],
            previewImage: '',
            quote: 'document describes the parameters you can use when opening Adobe® PDF files. These parameters  allow you to open a PDF file using a UR',
        },
    ]);
    const notesContainerRef = React.useRef<HTMLDivElement | null>(null);
    let noteId = notes.length;

    const noteEles: Map<number, HTMLElement> = new Map();
    const renderHighlightTarget = (props: RenderHighlightTargetProps) => (
        <div
            style={{
                background: '#eee',
                display: 'flex',
                position: 'absolute',
                left: `${props.selectionRegion.left}%`,
                top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
                transform: 'translate(0, 8px)',
                zIndex: 2,
            }}
        >
            <Tooltip
                position={Position.TopCenter}
                target={
                    <Button onClick={props.toggle}>
                        <MessageIcon />
                    </Button>
                }
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
                    previewImage: props.previewImage,
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
                    transform: 'translate(0, 8px)',
                    zIndex: 1,
                }}
            >
                <div>
                    <textarea
                        rows={3}
                        style={{
                            border: '1px solid rgba(0, 0, 0, .3)',
                        }}
                        onChange={(e) => setMessage(e.target.value)}
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
        const notesContainer = notesContainerRef.current;
        if (noteEles.has(note.id) && notesContainer) {
            notesContainer.scrollTop = noteEles.get(note.id).getBoundingClientRect().top;
        }
    };

    const renderHighlights = (props: RenderHighlightsProps) => (
        <div>
            {notes.map((note) => (
                <React.Fragment key={note.id}>
                    {note.highlightAreas
                        .filter((area) => area.pageIndex === props.pageIndex)
                        .map((area, idx) => (
                            <div
                                key={idx}
                                style={Object.assign(
                                    {},
                                    {
                                        background: 'yellow',
                                        opacity: 0.4,
                                    },
                                    props.getCssProperties(area, props.rotation),
                                )}
                                onClick={() => jumpToNote(note)}
                            />
                        ))}
                </React.Fragment>
            ))}
        </div>
    );

    const highlightPluginInstance = highlightPlugin({
        renderHighlightTarget,
        renderHighlightContent,
        renderHighlights,
        trigger: Trigger.None,
    });
    const { jumpToHighlightArea, switchTrigger } = highlightPluginInstance;

    const sidebarNotes = (
        <div
            ref={notesContainerRef}
            style={{
                overflow: 'auto',
                width: '100%',
            }}
        >
            {notes.length === 0 && <div style={{ textAlign: 'center' }}>There is no note</div>}
            {notes.map((note) => {
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
                        {note.previewImage ? (
                            <img
                                src={note.previewImage}
                                style={{
                                    height: 'auto',
                                    width: '100%',
                                }}
                            />
                        ) : (
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
                        )}
                        {note.content}
                    </div>
                );
            })}
        </div>
    );

    return (
        <div
            style={{
                border: '1px solid rgba(0, 0, 0, .3)',
                display: 'flex',
                flexDirection: 'column',
                height: '50rem',
                width: '64rem',
                margin: '1rem auto',
            }}
        >
            <div
                style={{
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(0, 0, 0, .3)',
                    display: 'flex',
                    padding: '0.5rem',
                }}
            >
                <div style={{ marginRight: '0.5rem' }}>
                    <Button onClick={() => switchTrigger(Trigger.None)}>Switch to None</Button>
                </div>
                <Button onClick={() => switchTrigger(Trigger.TextSelection)}>Switch to Selection</Button>
            </div>
            <div
                style={{
                    display: 'flex',
                    flex: 1,
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        borderRight: '1px solid rgba(0, 0, 0, .3)',
                        width: '25%',
                    }}
                >
                    {sidebarNotes}
                </div>
                <div
                    style={{
                        flex: 1,
                        overflow: 'hidden',
                    }}
                >
                    <Viewer fileUrl="/pdf-open-parameters.pdf" plugins={[highlightPluginInstance]} />
                </div>
            </div>
        </div>
    );
};

export default IndexPage;
