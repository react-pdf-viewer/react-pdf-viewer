import React from 'react';
import { OpenFile, Viewer, Worker } from '@react-pdf-viewer/core';

import { defaultLayoutPlugin, ToolbarSlot } from '@react-pdf-viewer/default-layout';
import { MoreActionsPopover } from '@react-pdf-viewer/toolbar';

import '@react-pdf-viewer/default-layout/styles/index.css';

// const toolbarPluginInstance = toolbarPlugin({
//     downloadPlugin: {
//         fileNameGenerator: (file: OpenFile) => {
//             const fileName = file.name.substring(file.name.lastIndexOf('/') + 1);
//             return `a-copy-of-${fileName}`;
//         },
//     },
//     searchPlugin: {
//         keyword: 'PDF',
//     },
// });

const App = () => {
    const renderToolbar = (toolbarSlot: ToolbarSlot) => {
        const {
            CurrentPageInput, Download, EnterFullScreen, GoToNextPage, GoToPreviousPage,
            NumberOfPages, Open, Print, ShowSearchPopover, Zoom, ZoomIn,
            ZoomOut,
        } = toolbarSlot;
        
        return (
            <div className='rpv-toolbar'>
                <div className='rpv-toolbar-left'>
                    <div className='rpv-toolbar-item'>
                        <ShowSearchPopover />
                    </div>
                    <div className='rpv-toolbar-item'>
                        <GoToPreviousPage />
                    </div>
                    <div className='rpv-toolbar-item'>
                        <CurrentPageInput /> / <NumberOfPages />
                    </div>
                    <div className='rpv-toolbar-item'>
                        <GoToNextPage />
                    </div>
                </div>
                <div className='rpv-toolbar-center'>
                    <div className='rpv-toolbar-item'>
                        <ZoomOut />
                    </div>
                    <div className='rpv-toolbar-item'>
                        <Zoom />
                    </div>
                    <div className='rpv-toolbar-item'>
                        <ZoomIn />
                    </div>
                </div>
                <div className='rpv-toolbar-right'>
                    <div className='rpv-toolbar-item'>
                        <EnterFullScreen />
                    </div>
                    <div className='rpv-toolbar-item'>
                        <Open />
                    </div>
                    <div className='rpv-toolbar-item'>
                        <Download />
                    </div>
                    <div className='rpv-toolbar-item'>
                        <Print />
                    </div>
                    <div className='rpv-toolbar-item'>
                        <MoreActionsPopover toolbarSlot={toolbarSlot} />
                    </div>
                </div>
            </div>
        );
    };

    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        renderToolbar,
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
                        defaultLayoutPluginInstance,
                    ]}
                />
            </div>
        </Worker>
    );
};

export default App;
