import React from 'react';
import Viewer, { Worker } from '@phuocng/react-pdf-viewer';

import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css';
import currentPagePlugin from './current-page';

const currentPage = currentPagePlugin();
const { CurrentPageLabel } = currentPage;

const App = () => {
    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.4.456/build/pdf.worker.js">
            <CurrentPageLabel />
            <div style={{ height: '750px', padding: '16px 0' }}>
                <Viewer
                    fileUrl="/pdf-open-parameters.pdf"
                    plugins={[currentPage]}
                />
            </div>
        </Worker>
    );
};

export default App;
