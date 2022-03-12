import React from 'react';
import { render } from 'react-dom';
import { Worker } from '@react-pdf-viewer/core';

import App from './App';

const rootElement = document.getElementById('root');
render(
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.13.216/build/pdf.worker.js">
        <App />
    </Worker>,
    rootElement
);
