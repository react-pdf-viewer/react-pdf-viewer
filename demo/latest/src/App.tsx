import React from 'react';
import Viewer, { Worker } from '@phuocng/react-pdf-viewer';

import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css';
import JumpToPage from './JumpToPage';
//import CustomToolbar from './CustomToolbar';

const App = () => {
    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.2.228/build/pdf.worker.min.js">
            <JumpToPage
                fileUrl="/pdf-open-parameters.pdf"
            />
        </Worker>
    );
};

export default App;
