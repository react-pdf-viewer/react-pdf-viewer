import { Provider, type PdfJsApiProvider } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/drop/lib/styles/index.css';
import '@react-pdf-viewer/highlight/lib/styles/index.css';
import * as PdfJs from 'pdfjs-dist';
import * as React from 'react';
import '../styles/index.css';

export default function MyApp({ Component, pageProps }) {
    const apiProvider = PdfJs as unknown as PdfJsApiProvider;

    return (
        <Provider pdfApiProvider={apiProvider} workerUrl="/pdf.worker.min.mjs">
            <Component {...pageProps} />
        </Provider>
    );
}
