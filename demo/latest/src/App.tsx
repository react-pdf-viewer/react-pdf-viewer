import React from 'react';
import { Worker } from '@phuocng/react-pdf-viewer';

import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css';
import SinglePageViewExample from './SinglePageViewExample';

const App = () => {
    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.2.228/build/pdf.worker.min.js">
            <div style={{ height: '750px', padding: '16px 0' }}>
                <SinglePageViewExample
                    fileUrl="/pdf-open-parameters.pdf"
                />
            </div>
        </Worker>
    );
};

export default App;
