import { Worker } from '@react-pdf-viewer/core';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(
    <React.StrictMode>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.13.216/build/pdf.worker.js">
            <App />
        </Worker>
    </React.StrictMode>
);
