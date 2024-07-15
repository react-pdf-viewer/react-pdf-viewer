import { Provider, type PdfJsApiProvider } from '@react-pdf-viewer/core';
import * as PdfJs from 'pdfjs-dist';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

const apiProvider = PdfJs as unknown as PdfJsApiProvider;

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(
    <React.StrictMode>
        <Provider pdfApiProvider={apiProvider} workerUrl="/pdf.worker.min.mjs">
            <App />
        </Provider>
    </React.StrictMode>,
);
