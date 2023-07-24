import { Worker } from '@react-pdf-viewer/worker';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(
    <React.StrictMode>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.8.162/build/pdf.worker.js">
            <App />
        </Worker>
    </React.StrictMode>,
);
