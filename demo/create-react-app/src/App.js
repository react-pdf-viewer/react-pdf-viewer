import React from 'react';
import Viewer, { Worker } from '@phuocng/react-pdf-viewer';

import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css';

function App() {
  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.5.207/build/pdf.worker.min.js">
        <div style={{ height: '750px' }}>
            <Viewer fileUrl={`${process.env.PUBLIC_URL}/pdf-open-parameters.pdf`} />
        </div>
    </Worker>
  );
}

export default App;
