import { Button, DocumentLoadEvent, PdfJs, Position, PrimaryButton, Tooltip, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import {
    HighlightArea,
    highlightPlugin,
    MessageIcon,
    RenderHighlightContentProps,
    RenderHighlightsProps,
    RenderHighlightTargetProps,
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
            content: 'A simple text based note',
            highlightAreas: [
                {
                    height: 1.52844549202031,
                    left: 16.36300706077807,
                    pageIndex: 3,
                    top: 39.13215031098466,
                    width: 36.86193409940468,
                },
                {
                    height: 1.19617473288546,
                    left: 0,
                    pageIndex: 3,
                    top: 10.56621014048823,
                    width: 0,
                },
                {
                    height: 1.3259679981725108,
                    left: 16.36300706077807,
                    pageIndex: 3,
                    top: 40.848536451140625,
                    width: 9.779053241381698,
                },
                {
                    height: 1.3259679981725108,
                    left: 26.141492454658728,
                    pageIndex: 3,
                    top: 40.848536451140625,
                    width: 0.4914855323272878,
                },
                {
                    height: 1.52844549202031,
                    left: 26.515298352485118,
                    pageIndex: 3,
                    top: 40.71562814748668,
                    width: 20.483919640384883,
                },
            ],
            previewImage: '',
            quote: 'Configuring and administering a system for online  collaboration  using comment repositories',
        },
        {
            id: 2,
            content: 'A simple image based note',
            highlightAreas: [
                {
                    pageIndex: 4,
                    top: 43.6479,
                    left: 20.5386,
                    height: 1.86072,
                    width: 12.3162,
                },
            ],
            previewImage:
                'data:image/png;base64,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',
            quote: '',
        },
    ]);
    const notesContainerRef = React.useRef<HTMLDivElement | null>(null);
    let noteId = notes.length;

    const noteEles: Map<number, HTMLElement> = new Map();
    const [currentDoc, setCurrentDoc] = React.useState<PdfJs.PdfDocument | null>(null);

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
        activateTab(3);
        const notesContainer = notesContainerRef.current;
        if (noteEles.has(note.id) && notesContainer) {
            notesContainer.scrollTop = noteEles.get(note.id).getBoundingClientRect().top;
        }
    };

    const renderHighlights = (props: RenderHighlightsProps) => (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: '100%',
            }}
        >
            {notes.map((note) => {
                // Find the highlight areas belonging to the same page
                const highlightAreas = note.highlightAreas.filter(
                    (area) => area.pageIndex === props.pageIndex && area.width > 0
                );
                if (!highlightAreas.length) {
                    return <React.Fragment key={note.id}></React.Fragment>;
                }

                const topArea = highlightAreas.sort((a, b) => a.top - b.top)[0];
                return (
                    <React.Fragment key={note.id}>
                        <div
                            style={Object.assign({}, props.getCssProperties(topArea, props.rotation), {
                                cursor: 'pointer',
                                // Position
                                right: '0',
                                transform: 'translate(50%, 0)',
                                zIndex: 2,
                                // Reset special properties created by `getCssProperties`
                                height: '',
                                left: '',
                                width: '',
                                // Center the content
                                alignItems: 'center',
                                display: 'flex',
                                justifyContent: 'center',
                                // Misc styles
                                background: '#fff',
                                border: '1px solid rgba(0, 0, 0, 0.2)',
                                borderRadius: '9999px',
                                padding: '0.25rem 0.5rem',
                            })}
                            title="Jump to note"
                            onClick={() => jumpToNote(note)}
                        >
                            <MessageIcon />
                        </div>
                        {highlightAreas.map((area, idx) => (
                            <div
                                key={idx}
                                style={Object.assign(
                                    {},
                                    {
                                        background: 'yellow',
                                        opacity: 0.3,
                                    },
                                    props.getCssProperties(area, props.rotation)
                                )}
                            />
                        ))}
                    </React.Fragment>
                );
            })}
        </div>
    );

    const highlightPluginInstance = highlightPlugin({
        renderHighlightTarget,
        renderHighlightContent,
        renderHighlights,
    });

    const { jumpToHighlightArea } = highlightPluginInstance;

    React.useEffect(() => {
        return () => {
            noteEles.clear();
        };
    }, []);

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
                        data-testid={`note-${note.id}`}
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

    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        sidebarTabs: (defaultTabs) =>
            defaultTabs.concat({
                content: sidebarNotes,
                icon: <MessageIcon />,
                title: 'Notes',
            }),
    });
    const { activateTab } = defaultLayoutPluginInstance;

    return (
        <div className="demo">
            <Viewer
                fileUrl="/pdf-open-parameters.pdf"
                plugins={[highlightPluginInstance, defaultLayoutPluginInstance]}
                onDocumentLoad={handleDocumentLoad}
            />
        </div>
    );
};

export default IndexPage;
