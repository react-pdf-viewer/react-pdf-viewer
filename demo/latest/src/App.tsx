import React from 'react';
import Viewer, { Worker } from '@phuocng/react-pdf-viewer';

import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css';
//import CustomToolbar from './CustomToolbar';

const App = () => {
    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.2.228/build/pdf.worker.min.js">
            <div
                style={{
                    height: '750px',
                }}
            >
                <Viewer
                    fileUrl="/pdf-open-parameters.pdf"
                />
            </div>
        </Worker>
    );
};

export default App;
