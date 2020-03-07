import React from 'react';
import Viewer, { Worker } from '@phuocng/react-pdf-viewer';

import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css';
import RenderPropsExample from './RenderPropsExample';
//import CustomToolbar from './CustomToolbar';

const App = () => {
    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.2.228/build/pdf.worker.min.js">
            <RenderPropsExample
                fileUrl="/pdf-open-parameters.pdf"
            />
        </Worker>
    );
};

export default App;
