import React from 'react';
import { Worker } from '@phuocng/react-pdf-viewer';

import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css';
import WaterMarkExample from './WaterMarkExample';

const App = () => {
    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.2.228/build/pdf.worker.min.js">
            <WaterMarkExample />
        </Worker>
    );
};

export default App;
