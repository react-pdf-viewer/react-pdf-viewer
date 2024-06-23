import { Provider, type PdfJsApiProvider } from '@react-pdf-viewer/core';
import * as PdfJs from 'pdfjs-dist';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const apiProvider = PdfJs as unknown as PdfJsApiProvider;

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(
    <React.StrictMode>
        <Provider pdfApiProvider={apiProvider} workerUrl="https://unpkg.com/pdfjs-dist@4.0.379/build/pdf.worker.mjs">
            <App />
        </Provider>
    </React.StrictMode>,
);
