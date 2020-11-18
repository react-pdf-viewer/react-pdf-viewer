import React, { ReactElement } from 'react';
import { Icon, Button, Position, Tooltip, Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin, ToolbarProps, ToolbarSlot } from '@react-pdf-viewer/default-layout';
import { highlightPlugin } from '@react-pdf-viewer/highlight';
import { NextIcon, PreviousIcon, RenderSearchProps } from '@react-pdf-viewer/search';

import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import './styles.css';

const App = () => {
    const renderToolbar = (Toolbar: ((props: ToolbarProps) => ReactElement)) => (
        <Toolbar>
        {
            (slots: ToolbarSlot) => {
                const { Search } = slots;
                return (
                    <div
                        style={{
                            alignItems: 'center',
                            display: 'flex',
                        }}
                    >
                        <Search>
                        {
                            (renderSearchProps: RenderSearchProps) => (
                                <>
                                    <div
                                        style={{
                                            border: '1px solid rgba(0, 0, 0, 0.3)',
                                            display: 'flex',
                                            padding: '0 2px',
                                        }}
                                    >
                                        <input
                                            style={{
                                                border: 'none',
                                                padding: '8px',
                                                width: '200px'
                                            }}
                                            placeholder='Enter to search'
                                            type="text"
                                            value={renderSearchProps.keyword}
                                            onChange={(e) => renderSearchProps.setKeyword(e.target.value)}
                                            onKeyDown={(e) => e.keyCode === 13 && renderSearchProps.keyword && renderSearchProps.search()}
                                        />
                                        <Tooltip
                                            position={Position.BottomCenter}
                                            target={
                                                <button
                                                    style={{
                                                        background: '#fff',
                                                        border: 'none',
                                                        borderBottom: `2px solid ${renderSearchProps.matchCase ? 'blue' : 'transparent'}`,
                                                        height: '100%',
                                                        padding: '0 2px',
                                                    }}
                                                    onClick={() => renderSearchProps.changeMatchCase(!renderSearchProps.matchCase)}
                                                >
                                                    <Icon>
                                                        <path d="M15.979,21.725,9.453,2.612a.5.5,0,0,0-.946,0L2,21.725" />
                                                        <path d="M4.383 14.725L13.59 14.725" />
                                                        <path d="M0.5 21.725L3.52 21.725" />
                                                        <path d="M14.479 21.725L17.5 21.725" />
                                                        <path d="M22.5,21.725,18.377,9.647a.5.5,0,0,0-.946,0l-1.888,5.543" />
                                                        <path d="M16.92 16.725L20.794 16.725" />
                                                        <path d="M21.516 21.725L23.5 21.725" />
                                                    </Icon>
                                                </button>
                                            }
                                            content={() => 'Match case'}
                                            offset={{ left: 0, top: 8 }}
                                        />
                                        <Tooltip
                                            position={Position.BottomCenter}
                                            target={
                                                <button
                                                    style={{
                                                        background: '#fff',
                                                        border: 'none',
                                                        borderBottom: `2px solid ${renderSearchProps.wholeWords ? 'blue' : 'transparent'}`,
                                                        height: '100%',
                                                        padding: '0 2px',
                                                    }}
                                                    onClick={() => renderSearchProps.changeWholeWords(!renderSearchProps.wholeWords)}
                                                >
                                                    <Icon>
                                                        <path d="M0.500 7.498 L23.500 7.498 L23.500 16.498 L0.500 16.498 Z" />
                                                        <path d="M3.5 9.498L3.5 14.498" />
                                                    </Icon>
                                                </button>
                                            }
                                            content={() => 'Match whole word'}
                                            offset={{ left: 0, top: 8 }}
                                        />
                                    </div>
                                    {renderSearchProps.keyword && renderSearchProps.numberOfMatches === 0 && (  
                                        <div style={{ padding: '0 8px' }}>Not found</div>
                                    )}
                                    {renderSearchProps.keyword && renderSearchProps.numberOfMatches > 0 && (
                                        <div style={{ padding: '0 8px' }}>{renderSearchProps.currentMatch} of {renderSearchProps.numberOfMatches}</div>
                                    )}
                                    <div style={{ padding: '0 2px' }}>
                                        <Tooltip
                                            position={Position.BottomCenter}
                                            target={
                                                <Button onClick={renderSearchProps.jumpToPreviousMatch}>
                                                    <PreviousIcon />
                                                </Button>
                                            }
                                            content={() => 'Previous match'}
                                            offset={{ left: 0, top: 8 }}
                                        />
                                    </div>
                                    <div style={{ padding: '0 2px' }}>
                                        <Tooltip
                                            position={Position.BottomCenter}
                                            target={
                                                <Button onClick={renderSearchProps.jumpToNextMatch}>
                                                    <NextIcon />
                                                </Button>
                                            }
                                            content={() => 'Next match'}
                                            offset={{ left: 0, top: 8 }}
                                        />
                                    </div>
                                </>
                            )
                        }
                        </Search>
                    </div>
                )
            }
        }
        </Toolbar>
    );

    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        // renderToolbar,
        // toolbarPlugin: {
        //     scrollModePlugin: {
        //         scrollMode: ScrollMode.Vertical,
        //     },
        //     searchPlugin: {
        //         keyword: ['document', 'PDF'],
        //     },
        // },
    });

    const highlightPluginInstance = highlightPlugin();

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
                        defaultLayoutPluginInstance,
                        highlightPluginInstance,
                    ]}
                />
            </div>
        </Worker>
    );
};

export default App;
