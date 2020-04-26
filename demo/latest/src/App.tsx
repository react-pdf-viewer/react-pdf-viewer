import React from 'react';
import Viewer, { Worker } from '@phuocng/react-pdf-viewer';

import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css';
import RenderErrorExample from './RenderErrorExample';

const App = () => {
    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.2.228/build/pdf.worker.min.js">
            <div style={{ height: '750px', padding: '16px 0' }}>
                <RenderErrorExample fileUrl="/pdf-open-parameters1.pdf" />
            </div>
        </Worker>
    );
};

export default App;
