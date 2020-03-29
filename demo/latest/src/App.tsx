import React from 'react';
import { Worker } from '@phuocng/react-pdf-viewer';

import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css';
import LoadFromBase64Example from './LoadFromBase64Example';

const App = () => {
    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.2.228/build/pdf.worker.min.js">
            <div style={{ height: '750px', padding: '16px 0' }}>
                <LoadFromBase64Example />
            </div>
        </Worker>
    );
};

export default App;
