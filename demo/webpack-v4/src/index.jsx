import { LegacyWorker } from '@react-pdf-viewer/legacy-worker';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(
    <LegacyWorker workerUrl="/pdf.worker.min.js">
        <App />
    </LegacyWorker>,
);
