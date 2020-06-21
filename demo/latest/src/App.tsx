import React from 'react';
import Viewer, { Worker } from '@phuocng/react-pdf-viewer';

import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css';

const App = () => {
    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.4.456/build/pdf.worker.js">
            <div style={{ height: '750px', padding: '16px 0' }}>
                <Viewer fileUrl="/pdf-open-parameters.pdf" />
            </div>
        </Worker>
    );
};

export default App;
