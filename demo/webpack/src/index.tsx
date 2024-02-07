import { Worker } from '@react-pdf-viewer/core';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(
    <React.StrictMode>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@4.0.379/build/pdf.worker.mjs">
            <App />
        </Worker>
    </React.StrictMode>,
);
