import React from 'react';
import ReactDOM from 'react-dom';
import { Worker } from '@react-pdf-viewer/core';

import App from './App';

if (process.env.NODE_ENV === 'development') {
    const axe = require('@axe-core/react');
    axe(React, ReactDOM, 1000);
}

ReactDOM.render(
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.8.335/build/pdf.worker.js">
        <App />
    </Worker>,
    document.getElementById('root')
);
