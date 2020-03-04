import React from 'react';
import Viewer, { PdfJs, SelectionMode, Worker } from '@phuocng/react-pdf-viewer';

import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css';

const App = () => {
    const documentLoad = (doc: PdfJs.PdfDocument) => {
        console.log(`Document is loaded: ${doc.numPages}`)
    };

    const zoom = (doc: PdfJs.PdfDocument, scale: number) => {
        console.log(`Zoom document to ${scale}`);
    };

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.2.228/build/pdf.worker.min.js">
            <div
                style={{
                    height: '750px',
                }}
            >
                <Viewer
                    fileUrl="/pdf-open-parameters.pdf"
                    onDocumentLoad={documentLoad}
                    onZoom={zoom}
                />
            </div>
        </Worker>
    );
};

export default App;
